import Link from "next/link";
import Image from "next/image";
import { oxanium } from "../../../../utils/fonts";
import dbConnect from "../../../../lib/mongodb";
import Project from "../../../../models/Project";
import { notFound } from "next/navigation";

async function getProject(slug) {
  await dbConnect();
  const project = await Project.findOne({ slug });
  if (!project) {
    return null;
  }
  return JSON.parse(JSON.stringify(project));
}

export default async function ProjectPage({ params }) {
  const { slug } = params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col max-w-4xl p-4 mx-auto space-y-6">
      <div className="space-y-6">
        {/* Title */}
        <h1 className={`${oxanium.className} text-2xl font-bold text-yellow-600`}>
          {project.title}
        </h1>

        {/* Description */}
        <div className="space-y-2">
          <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Description</h2>
          <p className="text-neutral-300">{project.description}</p>
        </div>

        {/* Category and Year */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Category</h2>
            <p className="text-neutral-300 capitalize">{project.category}</p>
          </div>
          <div>
            <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Year</h2>
            <p className="text-neutral-300">{project.year}</p>
          </div>
        </div>

        {/* Authors */}
        <div className="space-y-2">
          <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Authors</h2>
          <div className="flex flex-wrap gap-2">
            {project.authors.map((author, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-neutral-800 text-neutral-300 rounded-full"
              >
                {author}
              </span>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {project.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-yellow-600/10 text-yellow-600 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Advisor */}
        {project.advisor && (
          <div className="space-y-2">
            <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Advisor</h2>
            <p className="text-neutral-300">{project.advisor}</p>
          </div>
        )}

        {/* Start Date */}
        {project.startDate && (
          <div className="space-y-2">
            <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Started</h2>
            <p className="text-neutral-300">{new Date(project.startDate).toLocaleDateString()}</p>
          </div>
        )}

        {/* End Date */}
        {project.endDate && (
          <div className="space-y-2">
            <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Completed</h2>
            <p className="text-neutral-300">{new Date(project.endDate).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {/* Back Link */}
      <div className="pt-4 border-t border-neutral-700">
        <Link
          href={`/projects/${project.category || 'other'}`}
          className="inline-flex items-center text-yellow-600 hover:text-yellow-500"
        >
          ← Back to {project.category || 'other'} projects
        </Link>
      </div>
    </div>
  );
}
