import Link from "next/link";
import { oxanium } from "../../utils/fonts";

export default function InitiativesPage() {
  return (
    <div className="flex flex-col max-w-2xl p-4 mx-auto text-neutral-300">
      <h1
        className={`${oxanium.className} text-3xl text-yellow-600 font-bold text-center uppercase tracking-wide p-2`}
      >
        Welcome to Initiatives page
      </h1>
      <div className="text-justify indent-4">
        <p>
          On this page, you’ll discover a comprehensive overview of the
          impactful initiatives our research group has actively engaged in over
          the past years. From pioneering efforts such as establishing the first
          Portuguese National Laboratory of Esports to launching cutting-edge
          post-graduation programs, our commitment to innovation shines through.
        </p>
        <p>
          Each of our events and initiatives is meticulously documented,
          providing transparent insight into our activities.
        </p>
        <p>
          Explore the listed pages to delve into the depth and breadth of our
          contributions, fostering trust and interest among stakeholders and
          collaborators alike.
        </p>
      </div>
      <br></br>
      <div className="flex flex-col mx-auto space-y-3 text-center">
        <span className="text-yellow-600 ">
          <Link href="/initiatives/post-graduation-in-esports-and-digital-communities">
            Post Graduation in Esports and Digital Communities
          </Link>
        </span>
        <span className="text-yellow-600 ">
          <Link href="/initiatives/national-laboratory-of-scientific-research-in-esports">
            National Laboratory of Scientific Research in Esports
          </Link>
        </span>
        <span className="text-yellow-600 ">
          <Link href="/initiatives/empower-giving-back-on-the-move">
            Empower - Giving back on the move
          </Link>
        </span>
      </div>
    </div>
  );
}
