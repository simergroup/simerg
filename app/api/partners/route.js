import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Partner from '../../../models/Partner';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    await dbConnect();
    const partners = await Partner.find({}).sort({ createdAt: -1 });
    return NextResponse.json(partners);
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
    const partner = await Partner.create(data);
    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
