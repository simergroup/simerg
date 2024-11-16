import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";
import { oxanium } from "../../utils/fonts";
import { TYPES_OF_PROJECTS } from "../../utils/data";

export default function Projects() {
  return (
    <div className="flex flex-col max-w-xl p-2 mx-auto space-y-4">
      <span
        className={`${oxanium.className} text-xl text-yellow-600 font-bold uppercase tracking-wide flex flex-col`}
      >
        Take a look at what we have done so far
      </span>
      <div className="space-y-2 indent-4 text-neutral-300">
        <p>
          In this section, you{"'"}ll discover a diverse array of our projects
          spanning multiple fields, including esports and sports marketing and
          consumption, mobility, para-sports.
        </p>
      </div>
      <ul className="flex flex-col max-w-lg text-neutral-200">
        {TYPES_OF_PROJECTS.map((projectType) => (
          <li
            key={projectType.name}
            className="p-2 rounded text-neutral-300 hover:bg-yellow-600 hover:text-neutral-900 group/item"
          >
            <Link
              href={`/projects/${projectType.slug}`}
              className="flex items-center justify-between space-x-10"
            >
              <p className="uppercase">{projectType.name}</p>
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
