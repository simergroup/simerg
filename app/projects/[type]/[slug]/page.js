import Link from "next/link";
import {
  MASTER_PROJECTS,
  RESEARCH_PROJECTS,
  PHD_PROJECTS,
} from "../../../../utils/data";
import Image from "next/image";
import { oxanium } from "../../../../utils/fonts";

export default function ProjectPage({ params }) {
  const { slug } = params;

  const project =
    MASTER_PROJECTS.find((project) => project.slug === slug) ||
    RESEARCH_PROJECTS.find((project) => project.slug === slug) ||
    PHD_PROJECTS.find((project) => project.slug === slug);

  return (
    <div className="flex flex-col items-center md:flex-row md:gap-5">
      {/* Image */}
      {project.image && (
        <Image
          src={project.image}
          alt={project.title + " image"}
          className="w-64 p-2 mx-auto md:w-80"
        ></Image>
      )}

      {/* Header */}
      <div className="flex flex-col max-w-2xl mx-auto space-y-2 text-neutral-300">
        <h1
          className={`${oxanium.className} text-2xl font-bold max-w-2xl text-center p-2 uppercase tracking-wide text-yellow-600`}
        >
          {project.title}
        </h1>

        {/* Description */}
        <div className="flex flex-col p-2 space-y-2 indent-4">
          <h2
            className={`${oxanium.className} font-bold indent-0 uppercase tracking-wide text-yellow-600`}
          >
            Abstract:
          </h2>
          {project.paragraph1 && <p>{project.paragraph1}</p>}
          {project.paragraph2 && <p>{project.paragraph2}</p>}
          {project.paragraph3 && <p>{project.paragraph3}</p>}
          {project.paragraph4 && <p>{project.paragraph4}</p>}
          {project.paragraph5 && <p>{project.paragraph5}</p>}

          {/* Implications */}
          {project.implications && (
            <div className="flex flex-col space-y-2">
              <h2
                className={`${oxanium.className} font-bold indent-0 uppercase tracking-wide text-yellow-600`}
              >
                Implications:
              </h2>
              <p>{project.implications}</p>
            </div>
          )}

          {/* Conclusion */}
          {project.conclusion && (
            <div className="flex flex-col space-y-2">
              <h2
                className={`${oxanium.className} font-bold indent-0 uppercase tracking-wide text-yellow-600`}
              >
                Conclusion:
              </h2>
              <p>{project.conclusion}</p>
            </div>
          )}

          {/* Keywords */}
          {project.keywords && (
            <div className="flex indent-1">
              <h2
                className={`${oxanium.className} font-bold indent-0 uppercase tracking-wide text-yellow-600`}
              >
                Keywords:
              </h2>
              <p>{project.keywords}</p>
            </div>
          )}

          {/* University */}
          {project.university && (
            <div className="flex indent-1">
              <h2
                className={`${oxanium.className} font-bold indent-0 uppercase tracking-wide text-yellow-600`}
              >
                University:
              </h2>
              <span>{project.university}</span>
            </div>
          )}

          {/* Year of Defense */}
          {project.year && (
            <div className="flex indent-1">
              <h2
                className={`${oxanium.className} font-bold indent-0 uppercase tracking-wide text-yellow-600`}
              >
                Year of Defense:
              </h2>
              <span>{project.year}</span>
            </div>
          )}

          <div className="flex space-x-2">
            {/* Author */}
            {project.author && (
              <div className="px-2 py-1 text-sm rounded indent-0 w-fit bg-neutral-700">
                <span className="font-bold">Author: </span>
                <span>{project.author}</span>
              </div>
            )}

            {/* Professor Advisor */}
            {project.professorAdvisor && (
              <div className="px-2 py-1 text-sm rounded w-fit indent-0 bg-neutral-700">
                <span className="font-bold">Professor Advisor: </span>
                <span>{project.professorAdvisor}</span>
              </div>
            )}

            {/* Co-Advisor */}
            {project.co_advisor && (
              <div className="px-2 py-1 text-sm rounded indent-0 w-fit bg-neutral-700">
                <span className="font-bold">Co-Advisor: </span>
                <span>{project.co_advisor}</span>
              </div>
            )}

            {/* Researchers */}
            {project.researchers && (
              <div className="px-2 py-1 text-sm rounded indent-0 w-fit bg-neutral-700">
                <span className="font-bold">Researchers: </span>
                <span>{project.researchers}</span>
              </div>
            )}
          </div>
          {/* Outputs */}
          {project.output1 && project.output2 && project.output3 && (
            <div className="flex flex-col space-y-2 indent-0">
              <h2
                className={`${oxanium.className} font-bold indent-0 uppercase tracking-wide text-yellow-600`}
              >
                Outputs:
              </h2>
              <Link
                target="_blank"
                href={project.output1}
                className="underline text-neutral-300 underline-offset-2 w-fit"
              >
                Esports and Olympic Games: a cross-cultural exploration of the
                player support behaviour towards the Olympics
              </Link>
              <Link
                target="_blank"
                href={project.output2}
                className="underline text-neutral-300 underline-offset-2 w-fit"
              >
                Understanding the Role of Sport Values on Social Capital and
                Word-of-Mouth on the Internet: A Case Study of Esports Games
              </Link>
              <Link
                target="_blank"
                href={project.output3}
                className="underline text-neutral-300 underline-offset-2 w-fit"
              >
                Do the Olympic values influence the social capital and the
                in-game commitment? A case study of esports players
              </Link>
            </div>
          )}

          {/* Website */}
          {project.website && (
            <div className="flex flex-col indent-0">
              <h2
                className={`${oxanium.className} font-bold indent-0 uppercase tracking-wide text-yellow-600`}
              >
                Project website:
              </h2>
              <Link
                target="_blank"
                href={project.website}
                className="underline text-neutral-300 underline-offset-2 w-fit"
              >
                {project.website}
              </Link>
            </div>
          )}

          {/* Book */}
          {project.book && (
            <div className="flex flex-col indent-0">
              <h2
                className={`${oxanium.className} font-bold indent-0 uppercase tracking-wide text-yellow-600`}
              >
                Project book:
              </h2>
              <Link
                target="_blank"
                href={project.book}
                className="underline text-neutral-300 underline-offset-2 w-fit"
              >
                {project.book}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
