import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "../../../lib/mongodb";
import Partner from "../../../models/Partner";

export async function GET() {
	try {
		await dbConnect();
		const partners = await Partner.find({}).sort({ createdAt: -1 });
		return NextResponse.json(partners);
	} catch (error) {
		console.error("GET /api/partners error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();
		const data = await request.json();

		const partner = await Partner.create({
			name: data.name,
			description: data.description,
			logo: data.logo,
		});

		return NextResponse.json(partner);
	} catch (error) {
		console.error("POST /api/partners error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
