import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Initiative from '../../../../models/Initiative';
import { getServerSession } from 'next-auth';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const initiative = await Initiative.findById(params.id);
    if (!initiative) {
      return NextResponse.json({ error: 'Initiative not found' }, { status: 404 });
    }
    return NextResponse.json(initiative);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const initiative = await Initiative.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!initiative) {
      return NextResponse.json({ error: 'Initiative not found' }, { status: 404 });
    }
    return NextResponse.json(initiative);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const initiative = await Initiative.findByIdAndDelete(params.id);
    if (!initiative) {
      return NextResponse.json({ error: 'Initiative not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Initiative deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
