"use client"

import Link from "next/link";
import { oxanium } from "../utils/fonts";
import { FaAngleRight } from "react-icons/fa";
import { useProjects } from "../hooks/useProjects";
import { useEffect, useState } from "react";

export default function ProjectsList({ type }) {
  const { projects, loading, error } = useProjects();
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    // Filter projects based on type or show all if type is 'other'
    const filtered = type === 'other' 
      ? projects.filter(project => !project.category)
      : projects.filter(project => project.category === type);
    setFilteredProjects(filtered);
  }, [projects, type]);

  const categoryTitles = {
    master: 'Master Projects',
    phd: 'PhD Projects',
    research: 'Research Projects',
    other: 'Other Projects'
  };

  if (loading) {
    return (
      <div className="flex flex-col p-4 mx-auto space-y-4 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-800 rounded w-1/3"></div>
          <div className="h-4 bg-neutral-800 rounded w-2/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col p-4 mx-auto space-y-4 max-w-4xl">
        <div className="text-red-500">Error loading projects: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 mx-auto space-y-8 max-w-4xl">
      <div className="space-y-4">
        <h1 className={`${oxanium.className} text-2xl text-yellow-600 font-bold`}>
          {categoryTitles[type] || 'Projects'}
        </h1>
        <p className="text-neutral-300">
          Browse through our {type} projects and discover our research initiatives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <Link
            key={project._id}
            href={`/projects/${type}/${project.slug}`}
            className="block p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <h2 className="text-lg font-semibold text-yellow-400 mb-2">
              {project.title}
            </h2>
            <p className="text-neutral-300 line-clamp-3">
              {project.description}
            </p>
            <div className="mt-2 flex items-center text-yellow-500 text-sm">
              Learn more <FaAngleRight className="ml-1" />
            </div>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center text-neutral-400 py-8">
          No projects found in this category.
        </div>
      )}
    </div>
  );
}
