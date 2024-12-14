import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import News from "../../../models/News";
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

function generateSlug(title) {
	return title
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
		.replace(/[^\w\s-]/g, "") // Remove non-word chars
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/^-+|-+$/g, ""); // Remove leading/trailing -
}

// GET all news
export async function GET() {
	try {
		await dbConnect();
		const news = await News.find({}).sort({ publishedAt: -1 });
		return NextResponse.json(news);
	} catch (error) {
		console.error("Error in GET /api/news:", error);
		return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
	}
}

// POST new news item
export async function POST(request) {
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await request.formData();
		const title = formData.get("title");
		const content = formData.get("content");
		const publishDate = formData.get("publishDate");
		const images = formData.getAll("images");

		// Generate slug from title
		const slug = generateSlug(title);

		await dbConnect();

		// Check for slug uniqueness
		const existingNews = await News.findOne({ slug });
		if (existingNews) {
			return NextResponse.json(
				{ error: "A news item with a similar title already exists" },
				{ status: 409 }
			);
		}

		// Upload images to Cloudinary
		const imageUrls = [];
		for (const image of images) {
			if (image) {
				// If it's already a Cloudinary URL, keep it
				imageUrls.push(image);
			}
		}

		const news = await News.create({
			title,
			slug,
			content,
			publishDate,
			images: imageUrls,
		});

		return NextResponse.json(news);
	} catch (error) {
		console.error("Error in POST /api/news:", error);
		return NextResponse.json({ error: "Error creating news: " + error.message }, { status: 500 });
	}
}
