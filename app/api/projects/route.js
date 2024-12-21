import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Project from "../../../models/Project";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET() {
	console.log("GET /api/projects - Fetching projects");
	try {
		await dbConnect();
		console.log("Database connected, fetching projects...");

		const projects = await Project.find({}).sort({ createdAt: -1 });
		console.log(`Found ${projects.length} projects`);

		return NextResponse.json(projects);
	} catch (error) {
		console.error("GET /api/projects error:", error);
		console.error("Error stack:", error.stack);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function POST(request) {
	console.log("POST /api/projects - Creating new project");
	try {
		const session = await getServerSession();
		console.log("Auth session:", session);

		if (!session) {
			console.warn("Unauthorized attempt to create project");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

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

		// Generate slug from title if not provided
		if (!projectData.slug) {
			const title = projectData.title;
			const slug = title
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
				.replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
				.replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
			projectData.slug = slug;
		}

		// Validate required fields
		const missingFields = [];
		if (!projectData.title) missingFields.push("title");
		if (!projectData.description) missingFields.push("description");
		if (!projectData.category) missingFields.push("category");
		if (!["master", "phd", "research"].includes(projectData.category)) {
			return NextResponse.json(
				{ error: "Invalid category. Must be one of: master, phd, research" },
				{ status: 400 }
			);
		}

		// Validate category-specific fields
		if (projectData.category !== "research") {
			if (!projectData.year) missingFields.push("year");
			if (!projectData.professorAdvisor) missingFields.push("professorAdvisor");
		}
		if (projectData.category === "phd" && !projectData.university) {
			missingFields.push("university");
		}
		if (projectData.category === "research" && !projectData.authorType) {
			missingFields.push("authorType");
		}

		// Validate arrays
		if (!Array.isArray(projectData.keywords) || projectData.keywords.length === 0) {
			missingFields.push("keywords");
		}
		if (!Array.isArray(projectData.authors) || projectData.authors.length === 0) {
			missingFields.push("authors");
		}

		if (missingFields.length > 0) {
			console.error("Missing required fields:", missingFields);
			return NextResponse.json(
				{ error: `Missing required fields: ${missingFields.join(", ")}` },
				{ status: 400 }
			);
		}

		// Handle image upload if present
		let imageUrl = null;
		if (projectData.image && projectData.image instanceof Blob) {
			try {
				const bytes = await projectData.image.arrayBuffer();
				const buffer = Buffer.from(bytes);

				const uploadResponse = await new Promise((resolve, reject) => {
					const uploadStream = cloudinary.uploader.upload_stream(
						{
							folder: "simerg/projects",
						},
						(error, result) => {
							if (error) {
								console.error("Cloudinary upload error:", error);
								reject(error);
							} else {
								resolve(result);
							}
						}
					);

					uploadStream.end(buffer);
				});

				imageUrl = uploadResponse.secure_url;
				console.log("Image uploaded successfully:", imageUrl);
			} catch (error) {
				console.error("Error uploading image:", error);
				return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
			}
		}

		try {
			const project = await Project.create({
				...projectData,
				...(imageUrl && { image: imageUrl }),
			});
			console.log("Project created:", project);
			return NextResponse.json(project);
		} catch (error) {
			console.error("Error creating project:", error);
			return NextResponse.json(
				{ error: error.message || "Failed to create project" },
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error("Error creating project:", error);
		return NextResponse.json(
			{ error: "Error creating project: " + error.message },
			{ status: 500 }
		);
	}
}
