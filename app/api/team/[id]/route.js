import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Team from "../../../../models/Team";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function PUT(request, { params }) {
	console.log("PUT /api/team/[id] - Updating team member");
	try {
		const session = await getServerSession();
		console.log("Auth session:", session);

		if (!session) {
			console.warn("Unauthorized attempt to update team member");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = params;
		console.log("Updating team member with ID:", id);

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
		const roles = JSON.parse(formData.get("roles") || "[]");
		const image = formData.get("image");

		console.log("Received form data:", { name, description, roles, hasImage: !!image });

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
								folder: "team",
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
			name,
			description,
			roles,
			...(imageUrl && { image: imageUrl }),
		};

		const teamMember = await Team.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true, runValidators: true }
		);

		if (!teamMember) {
			console.log("Team member not found:", id);
			return NextResponse.json({ error: "Team member not found" }, { status: 404 });
		}

		console.log("Team member updated successfully:", teamMember);
		return NextResponse.json(teamMember);
	} catch (error) {
		console.error("Error updating team member:", error);
		return NextResponse.json(
			{ error: "Error updating team member: " + error.message },
			{ status: 500 }
		);
	}
}

export async function DELETE(request, { params }) {
	console.log("DELETE /api/team/[id] - Deleting team member");
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = params;
		await dbConnect();

		const teamMember = await Team.findByIdAndDelete(id);
		if (!teamMember) {
			return NextResponse.json({ error: "Team member not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "Team member deleted successfully" });
	} catch (error) {
		console.error("Error deleting team member:", error);
		return NextResponse.json(
			{ error: "Error deleting team member: " + error.message },
			{ status: 500 }
		);
	}
}
