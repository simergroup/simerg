import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Initiative from "../../../../models/Initiative";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET(request, { params }) {
	const { id } = params;

	try {
		await dbConnect();
		let initiative;

		// Check if the id is a MongoDB ObjectId
		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			initiative = await Initiative.findById(id);
		} else {
			// If not a MongoDB ObjectId, treat it as a slug
			initiative = await Initiative.findOne({ slug: id });
		}

		if (!initiative) {
			return NextResponse.json({ error: "Initiative not found" }, { status: 404 });
		}

		return NextResponse.json(initiative);
	} catch (error) {
		console.error("Error in GET /api/initiatives/[id]:", error);
		return NextResponse.json({ error: "Error fetching initiative" }, { status: 500 });
	}
}

export async function PUT(request, { params }) {
	console.log("PUT /api/initiatives/[id] - Updating initiative");
	try {
		const session = await getServerSession();
		console.log("Auth session:", session);

		if (!session) {
			console.warn("Unauthorized attempt to update initiative");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = params;
		console.log("Updating initiative with ID:", id);

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
								folder: "initiatives",
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

		const initiative = await Initiative.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true, runValidators: true }
		);

		if (!initiative) {
			console.log("Initiative not found:", id);
			return NextResponse.json({ error: "Initiative not found" }, { status: 404 });
		}

		console.log("Initiative updated successfully:", initiative);
		return NextResponse.json(initiative);
	} catch (error) {
		console.error("Error updating initiative:", error);
		return NextResponse.json(
			{ error: "Error updating initiative: " + error.message },
			{ status: 500 }
		);
	}
}

export async function DELETE(request, { params }) {
	console.log("DELETE /api/initiatives/[id] - Deleting initiative");
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = params;
		await dbConnect();

		const initiative = await Initiative.findByIdAndDelete(id);
		if (!initiative) {
			return NextResponse.json({ error: "Initiative not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "Initiative deleted successfully" });
	} catch (error) {
		console.error("Error deleting initiative:", error);
		return NextResponse.json(
			{ error: "Error deleting initiative: " + error.message },
			{ status: 500 }
		);
	}
}
