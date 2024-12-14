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

		// Check content type
		const contentType = request.headers.get("content-type");
		if (!contentType || !contentType.includes("multipart/form-data")) {
			return NextResponse.json(
				{ error: "Content type must be multipart/form-data" },
				{ status: 400 }
			);
		}

		// Parse form data
		const formData = await request.formData();
		const title = formData.get("title");
		const description = formData.get("description");
		const category = formData.get("category");
		const status = formData.get("status");
		const startDate = formData.get("startDate");
		const endDate = formData.get("endDate");
		const goals = JSON.parse(formData.get("goals") || "[]");
		const website = formData.get("website");
		const image = formData.get("image");

		console.log("Received form data:", {
			title,
			description,
			category,
			status,
			startDate,
			endDate,
			goals,
			website,
			hasImage: !!image,
		});

		// Generate slug from title
		const slug = title
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
			.replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
			.replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

		// Validate required fields
		const missingFields = [];
		if (!title) missingFields.push("title");
		if (!description) missingFields.push("description");
		if (!category) missingFields.push("category");
		if (!status) missingFields.push("status");
		if (!startDate) missingFields.push("startDate");

		if (missingFields.length > 0) {
			console.error("Missing required fields:", missingFields);
			return NextResponse.json(
				{ error: `Missing required fields: ${missingFields.join(", ")}` },
				{ status: 400 }
			);
		}

		// Handle image upload if present
		let imageUrl = null;
		if (image && image instanceof Blob) {
			try {
				const bytes = await image.arrayBuffer();
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

		const updateData = {
			title,
			slug,
			description,
			category,
			status,
			startDate,
			endDate,
			goals,
			website,
			...(imageUrl && { image: imageUrl }),
		};

		const project = await Project.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true, runValidators: true }
		);

		if (!project) {
			console.log("Project not found:", id);
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		console.log("Project updated successfully:", project);
		return NextResponse.json(project);
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
