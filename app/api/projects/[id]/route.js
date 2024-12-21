import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Project from "../../../../models/Project";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET(request, { params }) {
	try {
		await dbConnect();
		const project = await Project.findById(params.id);
		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}
		return NextResponse.json(project);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function PUT(request, { params }) {
	console.log("PUT /api/projects/[id] - Updating project");
	try {
		const session = await getServerSession();
		console.log("Auth session:", session);

		if (!session) {
			console.warn("Unauthorized attempt to update project");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = params;
		console.log("Updating project with ID:", id);

		await dbConnect();
		console.log("Database connected");

		let projectData;
		const contentType = request.headers.get("content-type");

		if (contentType && contentType.includes("application/json")) {
			projectData = await request.json();
			console.log("Received JSON data:", projectData);
		} else if (contentType && contentType.includes("multipart/form-data")) {
			// Parse form data
			const formData = await request.formData();
			projectData = {
				title: formData.get("title"),
				description: formData.get("description"),
				category: formData.get("category"),
				year: formData.get("year"),
				keywords: JSON.parse(formData.get("keywords") || "[]"),
				authors: JSON.parse(formData.get("authors") || "[]"),
				professorAdvisor: formData.get("professorAdvisor"),
				university: formData.get("university"),
				coAdvisor: formData.get("coAdvisor"),
				authorType: formData.get("authorType"),
				website: formData.get("website"),
				book: formData.get("book"),
				image: formData.get("image"),
				pdfFile: formData.get("pdfFile"),
			};
			console.log("Received form data:", projectData);
		} else {
			return NextResponse.json(
				{ error: "Content type must be application/json or multipart/form-data" },
				{ status: 400 }
			);
		}

		// Validate required fields for ALL categories
		const missingFields = [];
		if (!projectData.title) missingFields.push("title");
		if (!projectData.description) missingFields.push("description");
		if (!projectData.category) missingFields.push("category");
		if (!Array.isArray(projectData.keywords) || projectData.keywords.length === 0) {
			missingFields.push("keywords (at least one required)");
		}
		if (!Array.isArray(projectData.authors) || projectData.authors.length === 0) {
			missingFields.push("authors (at least one required)");
		}

		// Validate category
		if (!["master", "phd", "research"].includes(projectData.category)) {
			return NextResponse.json(
				{ error: "Invalid category. Must be one of: master, phd, research" },
				{ status: 400 }
			);
		}

		// Validate category-specific required fields
		if (projectData.category !== "research") {
			// Required for both master and phd
			if (!projectData.year || projectData.year < 1900 || projectData.year > new Date().getFullYear() + 1) {
				missingFields.push(`year (must be between 1900 and ${new Date().getFullYear() + 1})`);
			}
			if (!projectData.professorAdvisor?.trim()) {
				missingFields.push("professor advisor");
			}
		} else {
			// Required for research
			if (!projectData.authorType || !["author", "researcher"].includes(projectData.authorType)) {
				missingFields.push("author type (must be 'author' or 'researcher')");
			}
		}

		// Required only for phd
		if (projectData.category === "phd" && !projectData.university?.trim()) {
			missingFields.push("university");
		}

		// Validate optional fields based on category
		const errors = [];
		
		if (projectData.category === "research") {
			// Research projects can't have these fields
			if (projectData.pdfFile) errors.push("PDF file is only allowed for master and phd projects");
			if (projectData.coAdvisor) errors.push("Co-advisor is only allowed for master and phd projects");
		} else {
			// Master and PhD projects can't have these fields
			if (projectData.website) errors.push("Website is only allowed for research projects");
			if (projectData.book) errors.push("Book is only allowed for research projects");
			if (projectData.image) errors.push("Image is only allowed for research projects");
		}

		if (errors.length > 0) {
			return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
		}

		if (missingFields.length > 0) {
			console.error("Missing or invalid required fields:", missingFields);
			return NextResponse.json(
				{ error: `Missing or invalid required fields: ${missingFields.join(", ")}` },
				{ status: 400 }
			);
		}

		// Generate slug from title if not provided
		if (!projectData.slug) {
			projectData.slug = projectData.title
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
				.replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
				.replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
		}

		// Handle image upload if present
		let imageUrl = null;
		if (projectData.image && projectData.image instanceof Blob) {
			try {
				const bytes = await projectData.image.arrayBuffer();
				const buffer = Buffer.from(bytes);

				const uploadResponse = await new Promise((resolve, reject) => {
					cloudinary.uploader
						.upload_stream(
							{
								folder: "projects",
							},
							(error, result) => {
								if (error) {
									console.error("Cloudinary upload error:", error);
									reject(error);
								} else {
									console.log("Image uploaded successfully:", result.secure_url);
									resolve(result);
								}
							}
						)
						.end(buffer);
				});

				imageUrl = uploadResponse.secure_url;
			} catch (error) {
				console.error("Error uploading image:", error);
				return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
			}
		}

		// Handle pdf file upload if present
		let pdfFileUrl = null;
		if (projectData.pdfFile && projectData.pdfFile instanceof Blob) {
			try {
				const bytes = await projectData.pdfFile.arrayBuffer();
				const buffer = Buffer.from(bytes);

				const uploadResponse = await new Promise((resolve, reject) => {
					cloudinary.uploader
						.upload_stream(
							{
								folder: "projects",
							},
							(error, result) => {
								if (error) {
									console.error("Cloudinary upload error:", error);
									reject(error);
								} else {
									console.log("Pdf file uploaded successfully:", result.secure_url);
									resolve(result);
								}
							}
						)
						.end(buffer);
				});

				pdfFileUrl = uploadResponse.secure_url;
			} catch (error) {
				console.error("Error uploading pdf file:", error);
				return NextResponse.json({ error: "Failed to upload pdf file" }, { status: 500 });
			}
		}

		// Prepare update data based on category
		let updateData = {
			title: projectData.title,
			slug: projectData.slug,
			description: projectData.description,
			category: projectData.category,
			keywords: projectData.keywords,
			authors: projectData.authors,
		};

		if (projectData.category === "research") {
			updateData = {
				...updateData,
				authorType: projectData.authorType,
				...(projectData.website?.trim() && { website: projectData.website.trim() }),
				...(projectData.book?.trim() && { book: projectData.book.trim() }),
				...(imageUrl && { image: imageUrl }),
			};
		} else {
			updateData = {
				...updateData,
				year: parseInt(projectData.year),
				professorAdvisor: projectData.professorAdvisor,
				...(projectData.coAdvisor?.trim() && { coAdvisor: projectData.coAdvisor.trim() }),
				...(pdfFileUrl && { pdfFile: pdfFileUrl }),
			};

			if (projectData.category === "phd") {
				updateData.university = projectData.university;
			}
		}

		try {
			const project = await Project.findByIdAndUpdate(
				id,
				updateData,
				{ new: true, runValidators: true }
			);

			if (!project) {
				return NextResponse.json({ error: "Project not found" }, { status: 404 });
			}

			return NextResponse.json(project);
		} catch (error) {
			console.error("Error updating project:", error);
			return NextResponse.json(
				{ error: `Error updating project: ${error.message}` },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Error updating project:", error);
		return NextResponse.json(
			{ error: "Error updating project: " + error.message },
			{ status: 500 }
		);
	}
}

export async function DELETE(request, { params }) {
	console.log("DELETE /api/projects/[id] - Deleting project");
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = params;
		await dbConnect();

		const project = await Project.findByIdAndDelete(id);
		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "Project deleted successfully" });
	} catch (error) {
		console.error("Error deleting project:", error);
		return NextResponse.json(
			{ error: "Error deleting project: " + error.message },
			{ status: 500 }
		);
	}
}
