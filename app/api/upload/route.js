import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(request) {
	try {
		console.log("Received upload request");

		const formData = await request.formData();
		const file = formData.get("file");

		if (!file) {
			console.log("No file found in request");
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		console.log("File details:", {
			name: file.name,
			type: file.type,
			size: file.size,
		});

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		console.log("Uploading to Cloudinary...");

		// Upload to Cloudinary
		const uploadResponse = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						folder: "simerg",
					},
					(error, result) => {
						if (error) {
							console.error("Cloudinary upload error:", error);
							reject(error);
						} else {
							console.log("Cloudinary upload successful:", {
								url: result.secure_url,
								format: result.format,
								size: result.bytes,
							});
							resolve(result);
						}
					}
				)
				.end(buffer);
		});

		return NextResponse.json({ url: uploadResponse.secure_url });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Failed to upload file: " + error.message }, { status: 500 });
	}
}
