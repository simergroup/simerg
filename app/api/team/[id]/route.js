import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "../../../../lib/mongodb";
import Team from "../../../../models/Team";

export async function DELETE(request, { params }) {
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();
		const { id } = params;

		// First verify the document exists
		const teamMember = await Team.findById(id);
		if (!teamMember) {
			return NextResponse.json({ error: "Team member not found" }, { status: 404 });
		}

		// Then delete it with explicit write concern
		await Team.findByIdAndDelete(id, {
			writeConcern: { w: 1, j: true },
		});

		return NextResponse.json({ message: "Team member deleted successfully" });
	} catch (error) {
		console.error("DELETE /api/team/[id] error:", error);
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

		const updatedTeamMember = await Team.findByIdAndUpdate(
			id,
			{
				name: data.name,
				role: data.role,
				description: data.description,
				image: data.image,
			},
			{ new: true, runValidators: true }
		);

		if (!updatedTeamMember) {
			return NextResponse.json({ error: "Team member not found" }, { status: 404 });
		}

		return NextResponse.json(updatedTeamMember);
	} catch (error) {
		console.error("PUT /api/team/[id] error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
