import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Project from '../../../models/Project';
import { getServerSession } from 'next-auth';

// Function to normalize text for slug (same as in model)
function generateSlug(text) {
  return text
    .toLowerCase()
    // Replace special characters with their normal equivalents
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace any non-word character with hyphen
    .replace(/[^\w\s-]/g, '')
    // Replace whitespace with hyphen
    .replace(/\s+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('GET /api/projects error:', error);
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
    
    // Generate slug before creating project
    const baseSlug = generateSlug(data.title);
    const slug = `${baseSlug}-${Date.now()}`;
    
    // Create project data with explicit fields only
    const projectData = {
      title: data.title,
      description: data.description,
      category: data.category || 'master',
      year: data.year || new Date().getFullYear(),
      keywords: data.keywords || [],
      authors: data.authors || [],
      advisor: data.advisor,
      slug: slug
    };
    
    console.log('Creating project with data:', projectData); // Log the final data
    
    const project = await Project.create(projectData);
    console.log('Created project:', project.toObject()); // Log the created project
    
    // Double check what's in the database
    const savedProject = await Project.findById(project._id);
    console.log('Saved project in database:', savedProject.toObject());
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
