import Image from "next/image";
import Link from "next/link";
import { INITIATIVES } from "../utils/data";
import { oxanium } from "../utils/fonts";

export default function InitiativesList({ slug }) {
  const initiative = INITIATIVES.find((initiative) => initiative.slug === slug);

  return (
    <div className="flex flex-col items-center max-w-3xl px-4 mx-auto space-y-2 text-neutral-300">
      <h2
        className={`${oxanium.className} font-bold text-2xl uppercase text-yellow-600`}
      >
        {initiative.title}
      </h2>
      {initiative.link && initiative.image && (
        <Link href={initiative.link} target="_blank">
          <Image
            src={initiative.image}
            alt={initiative.title + " image"}
            width={208}
            className="hover:scale-110"
          />
        </Link>
      )}
      <div className="py-6 space-y-2 text-justify indent-4">
        <p>{initiative.paragraph1}</p>
        <p>{initiative.paragraph2}</p>
        <p>{initiative.paragraph3}</p>
        <p>{initiative.paragraph4}</p>
        <p>{initiative.paragraph5}</p>
        <div className="indent-0">
          {initiative.link && (
            <Link
              href={initiative.link}
              target="_blank"
              className="font-bold text-yellow-600 underline underline-offset-2 w-fit hover:scale-105"
            >
              Check the FMH/UL Post-Graduation Degree website.
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
