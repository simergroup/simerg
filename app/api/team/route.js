import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Team from "../../../models/Team";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET() {
	console.log("GET /api/team - Fetching team members");
	try {
		await dbConnect();
		console.log("Database connected, fetching team members...");

		const team = await Team.find({}).sort({ createdAt: -1 });
		console.log(`Found ${team.length} team members`);

		return NextResponse.json(team);
	} catch (error) {
		console.error("GET /api/team error:", error);
		console.error("Error stack:", error.stack);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function POST(request) {
	console.log("POST /api/team - Creating new team member");
	try {
		const session = await getServerSession();
		console.log("Auth session:", session);

		if (!session) {
			console.warn("Unauthorized attempt to create team member");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		console.log("Connecting to database...");
		await dbConnect();
		console.log("Database connected");

		// Parse form data
		const formData = await request.formData();
		console.log("Received form data:", Object.fromEntries(formData.entries()));

		// Extract data from form
		const name = formData.get("name");
		const description = formData.get("description");
		const roles = JSON.parse(formData.get("roles") || "[]");
		const image = formData.get("image");

		// Validate required fields
		const missingFields = [];
		if (!name) missingFields.push("name");
		if (!description) missingFields.push("description");
		if (!roles || roles.length === 0) missingFields.push("roles");

		if (missingFields.length > 0) {
			console.error("Missing required fields:", missingFields);
			return NextResponse.json(
				{ error: `Missing required fields: ${missingFields.join(", ")}` },
				{ status: 400 }
			);
		}

		// Upload image to Cloudinary if it's a new file path
		let imageUrl = null;
		if (image && image.startsWith("/uploads/")) {
			try {
				const publicPath = path.join(process.cwd(), "public", image);
				const imageBuffer = await fs.readFile(publicPath);

				const uploadResponse = await new Promise((resolve, reject) => {
					cloudinary.uploader
						.upload_stream(
							{
								folder: "team-members",
							},
							(error, result) => {
								if (error) reject(error);
								else resolve(result);
							}
						)
						.end(imageBuffer);
				});

				imageUrl = uploadResponse.secure_url;
				console.log("Image uploaded to Cloudinary:", imageUrl);

				// Delete the local file after successful upload
				await fs.unlink(publicPath);
				console.log("Local file deleted:", publicPath);
			} catch (error) {
				console.error("Error uploading image to Cloudinary:", error);
				return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
			}
		}

		// Create team member data object
		const teamMemberData = {
			name,
			roles,
			description,
			...(image && { image }), // Include image if it exists
		};

		console.log("Attempting to create team member with data:", teamMemberData);

		const teamMember = await Team.create(teamMemberData);
		console.log("Created team member:", teamMember.toObject());

		return NextResponse.json(teamMember, { status: 201 });
	} catch (error) {
		console.error("POST /api/team error:", error);
		console.error("Error stack:", error.stack);
		return NextResponse.json(
			{ error: error.message || "Failed to create team member" },
			{ status: 500 }
		);
	}
}
