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
          {project.category !== "research" && (
            <div>
              <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Year</h2>
              <p className="text-neutral-300">{project.year}</p>
            </div>
          )}
        </div>

        {/* Authors */}
        <div className="space-y-2">
          <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>
            {project.category === "research" 
              ? (project.authorType === "researcher" ? "Researchers" : "Authors")
              : "Authors"}
          </h2>
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

        {/* Professor Advisor */}
        {project.professorAdvisor && (
          <div className="space-y-2">
            <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Professor Advisor</h2>
            <p className="text-neutral-300">{project.professorAdvisor}</p>
          </div>
        )}

        {/* PhD Specific Fields */}
        {project.category === "phd" && (
          <>
            {project.university && (
              <div className="space-y-2">
                <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>University</h2>
                <p className="text-neutral-300">{project.university}</p>
              </div>
            )}
            {project.coAdvisor && (
              <div className="space-y-2">
                <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Co-Advisor</h2>
                <p className="text-neutral-300">{project.coAdvisor}</p>
              </div>
            )}
          </>
        )}

        {/* Research Specific Fields */}
        {project.category === "research" && (
          <>
            {project.website && (
              <div className="space-y-2">
                <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Website</h2>
                <a href={project.website} target="_blank" rel="noopener noreferrer" 
                   className="text-yellow-600 hover:text-yellow-500 underline">
                  Visit Project Website
                </a>
              </div>
            )}
            {project.book && (
              <div className="space-y-2">
                <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Book</h2>
                <a href={project.book} target="_blank" rel="noopener noreferrer" 
                   className="text-yellow-600 hover:text-yellow-500 underline">
                  View Book
                </a>
              </div>
            )}
          </>
        )}

        {/* PDF Preview for Master and PhD */}
        {(project.category === "master" || project.category === "phd") && project.pdfFile && (
          <div className="space-y-2">
            <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Project Document</h2>
            <div className="flex items-center gap-2">
              <a
                href={project.pdfFile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500 transition-colors"
              >
                View PDF
              </a>
            </div>
          </div>
        )}

        {/* Image Preview for Research */}
        {project.category === "research" && project.image && (
          <div className="space-y-2">
            <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>Project Image</h2>
            <div className="relative aspect-video w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* External Links for Research */}
        {project.category === "research" && project.externalLinks && project.externalLinks.length > 0 && (
          <div className="space-y-2">
            <h2 className={`${oxanium.className} text-lg font-semibold text-yellow-500`}>External Links</h2>
            <div className="flex flex-col gap-2">
              {project.externalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-600 hover:text-yellow-500 underline"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Back to Projects */}
        <Link
          href="/projects"
          className="inline-flex items-center text-yellow-600 hover:text-yellow-500"
        >
          ← Back to Projects
        </Link>
      </div>
    </div>
  );
}
