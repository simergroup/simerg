import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "../../../../lib/mongodb";
import Partner from "../../../../models/Partner";

export async function DELETE(request, { params }) {
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();
		const { id } = params;

		// First verify the document exists
		const partner = await Partner.findById(id);
		if (!partner) {
			return NextResponse.json({ error: "Partner not found" }, { status: 404 });
		}

		// Then delete it with explicit write concern
		await Partner.findByIdAndDelete(id, {
			writeConcern: { w: 1, j: true },
		});

		return NextResponse.json({ message: "Partner deleted successfully" });
	} catch (error) {
		console.error("DELETE /api/partners/[id] error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function PUT(request, { params }) {
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();
		const { id } = params;
		const data = await request.json();

		const updatedPartner = await Partner.findByIdAndUpdate(
			id,
			{
				name: data.name,
				description: data.description,
				logo: data.logo,
			},
			{ new: true, runValidators: true }
		);

		if (!updatedPartner) {
			return NextResponse.json({ error: "Partner not found" }, { status: 404 });
		}

		return NextResponse.json(updatedPartner);
	} catch (error) {
		console.error("PUT /api/partners/[id] error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
