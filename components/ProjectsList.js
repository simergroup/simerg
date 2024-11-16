import Link from "next/link";
import {
  MASTER_PROJECTS,
  RESEARCH_PROJECTS,
  PHD_PROJECTS,
} from "../utils/data";
import { oxanium } from "../utils/fonts";
import { FaAngleRight } from "react-icons/fa";

export default function ProjectsList({ type }) {
  const projects =
    type === "master"
      ? MASTER_PROJECTS
      : type === "research"
        ? RESEARCH_PROJECTS
        : type === "phd"
          ? PHD_PROJECTS
          : [];

  return (
    <div className="flex flex-col max-w-xl p-2 mx-auto space-y-4">
      <h1
        className={`${oxanium.className} text-xl px-2 text-yellow-600 font-bold uppercase`}
      >
        Here goes the list of {type} projects we have developed so far
      </h1>
      <p className="px-2 text-neutral-300 indent-4">
        We are in constant research and development, so keep an eye open so you
        don{"'"}t miss anything we post.
      </p>
      <ul className="flex flex-col space-y-2 text-neutral-300">
        {projects.map((project) => (
          <li
            key={project.id}
            className="p-2 rounded text-neutral-300 hover:bg-yellow-600 hover:text-neutral-900 group/item"
          >
            <Link
              href={`/projects/${type}/${project.slug}`}
              className="flex items-center justify-between space-x-10"
            >
              <p>{project.title}</p>
              <FaAngleRight
                size={16}
                className="duration-500 group-hover/item:rotate-180 hover:transition-all"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
