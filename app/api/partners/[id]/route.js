import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Partner from '../../../../models/Partner';
import { getServerSession } from 'next-auth';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const partner = await Partner.findById(params.id);
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }
    return NextResponse.json(partner);
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
    const partner = await Partner.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }
    return NextResponse.json(partner);
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
    const partner = await Partner.findByIdAndDelete(params.id);
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
