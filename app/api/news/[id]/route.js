import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import News from "../../../../models/News";
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

// GET single news item by ID or slug
export async function GET(request, { params }) {
	const { id } = params;

	try {
		await dbConnect();
		let news;

		// Check if the id is a MongoDB ObjectId
		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			news = await News.findById(id);
		} else {
			// If not a MongoDB ObjectId, treat it as a slug
			news = await News.findOne({ slug: id });
		}

		if (!news) {
			return NextResponse.json({ error: "News not found" }, { status: 404 });
		}

		return NextResponse.json(news);
	} catch (error) {
		console.error("Error in GET /api/news/[id]:", error);
		return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
	}
}

// PUT update news item
export async function PUT(request, { params }) {
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = params;
		if (!id.match(/^[0-9a-fA-F]{24}$/)) {
			return NextResponse.json({ error: "Invalid news ID format" }, { status: 400 });
		}

		// Parse form data
		const formData = await request.formData();
		const title = formData.get("title");
		const content = formData.get("content");
		const publishDate = formData.get("publishDate");
		const images = formData.getAll("images");

		await dbConnect();

		// Generate slug if title is updated
		let slug;
		if (title) {
			slug = generateSlug(title);

			// Check for slug uniqueness
			const existingNews = await News.findOne({
				slug,
				_id: { $ne: id },
			});

			if (existingNews) {
				return NextResponse.json(
					{ error: "A news item with a similar title already exists" },
					{ status: 409 }
				);
			}
		}

		// Upload new images to Cloudinary
		const imageUrls = [];
		for (const image of images) {
			if (image) {
				// If it's already a Cloudinary URL, keep it
				imageUrls.push(image);
			}
		}

		const updateData = {
			...(title && { title, slug }),
			...(content && { content }),
			...(publishDate && { publishDate }),
			...(images.length > 0 && { images: imageUrls }),
		};

		const news = await News.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{
				new: true,
				runValidators: true,
			}
		);

		if (!news) {
			return NextResponse.json({ error: "News not found" }, { status: 404 });
		}

		return NextResponse.json(news);
	} catch (error) {
		console.error("Error in PUT /api/news/[id]:", error);
		return NextResponse.json({ error: "Error updating news: " + error.message }, { status: 500 });
	}
}

// DELETE news item
export async function DELETE(request, { params }) {
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = params;
		if (!id.match(/^[0-9a-fA-F]{24}$/)) {
			return NextResponse.json({ error: "Invalid news ID format" }, { status: 400 });
		}

		await dbConnect();
		const news = await News.findByIdAndDelete(params.id);

		if (!news) {
			return NextResponse.json({ error: "News not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "News deleted successfully" });
	} catch (error) {
		console.error("Error in DELETE /api/news/[id]:", error);
		return NextResponse.json({ error: "Error deleting news: " + error.message }, { status: 500 });
	}
}
