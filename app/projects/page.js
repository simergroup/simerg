import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";
import { oxanium } from "../../utils/fonts";
import dbConnect from "../../lib/mongodb";
import Project from "../../models/Project";

export default async function Projects() {
  await dbConnect();
  const projects = await Project.find({}).sort({ createdAt: -1 });

  // Group projects by category
  const groupedProjects = projects.reduce((acc, project) => {
    const category = project.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(project);
    return acc;
  }, {});

  const categoryTitles = {
    master: 'Master Projects',
    phd: 'PhD Projects',
    research: 'Research Projects',
    '': 'Other Projects'
  };

  return (
    <div className="flex flex-col max-w-4xl p-4 mx-auto space-y-8">
      <span className={`${oxanium.className} text-2xl text-yellow-600 font-bold uppercase tracking-wide`}>
        Our Research Projects
      </span>
      
      <div className="space-y-2 text-neutral-300">
        <p>
          Explore our diverse portfolio of research projects spanning multiple fields,
          including esports, sports marketing and consumption, mobility, and para-sports.
        </p>
      </div>

      {Object.entries(groupedProjects).map(([category, categoryProjects]) => (
        <div key={category} className="space-y-4">
          <h2 className={`${oxanium.className} text-xl text-yellow-500 font-semibold`}>
            {categoryTitles[category]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryProjects.map((project) => (
              <Link
                key={project._id}
                href={`/projects/${project.category || 'other'}/${project.slug}`}
                className="block p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  {project.title}
                </h3>
                <p className="text-neutral-300 line-clamp-3">
                  {project.description}
                </p>
                <div className="mt-2 flex items-center text-yellow-500 text-sm">
                  Learn more <FaAngleRight className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
