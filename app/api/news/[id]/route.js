import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import News from '../../../../models/News';
import { getServerSession } from 'next-auth';

// GET single news item
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const news = await News.findById(params.id);
    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update news item
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const news = await News.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE news item
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const news = await News.findByIdAndDelete(params.id);
    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
