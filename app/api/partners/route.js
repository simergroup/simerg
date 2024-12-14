import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Partner from "../../../models/Partner";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET() {
	console.log("GET /api/partners - Fetching partners");
	try {
		await dbConnect();
		console.log("Database connected, fetching partners...");

		const partners = await Partner.find({}).sort({ createdAt: -1 });
		console.log(`Found ${partners.length} partners`);

		return NextResponse.json(partners);
	} catch (error) {
		console.error("GET /api/partners error:", error);
		console.error("Error stack:", error.stack);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function POST(request) {
	console.log("POST /api/partners - Creating new partner");
	try {
		const session = await getServerSession();
		console.log("Auth session:", session);

		if (!session) {
			console.warn("Unauthorized attempt to create partner");
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
		const name = formData.get("name");
		const description = formData.get("description");
		const website = formData.get("website");
		const image = formData.get("image");

		console.log("Received form data:", {
			name,
			description,
			website,
			hasImage: !!image,
		});

		// Validate required fields
		const missingFields = [];
		if (!name) missingFields.push("name");
		if (!description) missingFields.push("description");

		if (missingFields.length > 0) {
			console.error("Missing required fields:", missingFields);
			return NextResponse.json(
				{ error: `Missing required fields: ${missingFields.join(", ")}` },
				{ status: 400 }
			);
		}

		// Handle image upload if present
		let imageUrl = null;
		if (image) {
			if (image instanceof Blob) {
				try {
					const bytes = await image.arrayBuffer();
					const buffer = Buffer.from(bytes);

					const uploadResponse = await new Promise((resolve, reject) => {
						cloudinary.uploader
							.upload_stream(
								{
									folder: "partners",
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
			} else {
				// If image is already a URL, use it directly
				imageUrl = image;
			}
		}

		const partner = await Partner.create({
			name,
			description,
			...(website && { website }),
			...(imageUrl && { image: imageUrl }),
		});

		console.log("Partner created successfully:", partner);
		return NextResponse.json(partner);
	} catch (error) {
		console.error("Error creating partner:", error);
		return NextResponse.json(
			{ error: "Error creating partner: " + error.message },
			{ status: 500 }
		);
	}
}
