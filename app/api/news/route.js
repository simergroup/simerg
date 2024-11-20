import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import News from '../../../models/News';
import { getServerSession } from 'next-auth';

// GET all news
export async function GET() {
  try {
    await dbConnect();
    const news = await News.find({}).sort({ publishedAt: -1 });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new news item
export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const news = await News.create(data);
    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
