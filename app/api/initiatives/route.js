import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Initiative from "../../../models/Initiative";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET() {
	console.log("GET /api/initiatives - Fetching initiatives");
	try {
		await dbConnect();
		console.log("Database connected, fetching initiatives...");

		const initiatives = await Initiative.find({}).sort({ createdAt: -1 });
		console.log(`Found ${initiatives.length} initiatives`);

		return NextResponse.json(initiatives);
	} catch (error) {
		console.error("GET /api/initiatives error:", error);
		console.error("Error stack:", error.stack);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function POST(request) {
	console.log("POST /api/initiatives - Creating new initiative");
	try {
		const session = await getServerSession();
		console.log("Auth session:", session);

		if (!session) {
			console.warn("Unauthorized attempt to create initiative");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

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
		const image = formData.get("image");
		const website = formData.get("website");

		console.log("Received form data:", {
			title,
			description,
			hasImage: !!image,
			website,
		});

		// Validate required fields
		const requiredFields = ["title", "description"];
		const missingFields = requiredFields.filter((field) => !formData.get(field));

		if (missingFields.length > 0) {
			return NextResponse.json(
				{ error: `Missing required fields: ${missingFields.join(", ")}` },
				{ status: 400 }
			);
		}

		// Generate slug from title
		const slug = title
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
			.replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
			.replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

		// Create initiative object with only the fields we want
		const initiative = {
			title,
			slug,
			description,
			...(image && { image }),
			...(website && { website }),
		};

		// Handle image upload if present
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

				initiative.image = uploadResponse.secure_url;
			} catch (error) {
				console.error("Error uploading image:", error);
				return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
			}
		}

		try {
			const createdInitiative = await Initiative.create(initiative);

			console.log("Initiative created successfully:", createdInitiative);
			return NextResponse.json(createdInitiative);
		} catch (error) {
			console.error("Error creating initiative:", error);
			return NextResponse.json(
				{ error: "Error creating initiative: " + error.message },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("POST /api/initiatives error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
