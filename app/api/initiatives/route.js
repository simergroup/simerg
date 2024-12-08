import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Initiative from '../../../models/Initiative';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    await dbConnect();
    const initiatives = await Initiative.find({}).sort({ createdAt: -1 });
    return NextResponse.json(initiatives);
  } catch (error) {
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
    const { title, description, image, category, status, startDate, endDate, goals, website, tags } = data;
    const initiative = await Initiative.create({
      title,
      description,
      image,
      category,
      status,
      startDate,
      endDate,
      goals,
      website,
      tags,
    });
    return NextResponse.json(initiative, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
