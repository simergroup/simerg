import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Team from '../../../models/Team';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    await dbConnect();
    const team = await Team.find({}).sort({ createdAt: -1 });
    return NextResponse.json(team);
  } catch (error) {
    console.error('GET /api/team error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    console.log('Received project data:', data); // Log the received data
    
    // Create project data with explicit fields only
    const teamMemberData = {
      name: data.name,
      role: data.role,
      description: data.description,
      image: data.image,
    };
    
    console.log('Creating team member with data:', teamMemberData); // Log the final data
    
    const teamMember = await Team.create(teamMemberData);
    console.log('Created team member:', teamMember.toObject()); // Log the created project
    
    // Double check what's in the database
    const savedTeamMember = await Team.findById(teamMember._id);
    console.log('Saved team member in database:', savedTeamMember.toObject());
    
    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error('POST /api/team error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
