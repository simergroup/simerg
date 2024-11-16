"use client";

import Image from "next/image";
import Background from "/public/fachada-fmh.png";
import { oxanium } from "../utils/fonts";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center w-full h-full lg:gap-5 lg:flex-row">
      <div className="flex justify-center h-fit w-fit">
        <Image src={Background} className="object-contain size-64 lg:size-96" alt="Fachada FMH" />
      </div>
      <div className="flex flex-col items-center w-full gap-5 p-4 md:max-w-lg lg:max-w-xl">
        <div className={`${oxanium.className} text-3xl font-bold uppercase tracking-wider text-yellow-600`}>
          <p>What is the SIMERG?</p>
        </div>
        <div className="h-fit w-fit md:flex md:flex-col md:justify-center lg:flex lg:w-full">
          <div className="space-y-2 text-base indent-4 text-neutral-300">
            <span className="font-bold text-yellow-600">SIMERG </span>
            <span>
              stands for <span className="font-bold text-yellow-600">S</span>ports,{" "}
              <span className="font-bold text-yellow-600">I</span>nnovation,{" "}
              <span className="font-bold text-yellow-600">M</span>anagement and{" "}
              <span className="font-bold text-yellow-600">E</span>sports{" "}
              <span className="font-bold text-yellow-600">R</span>esearch{" "}
              <span className="font-bold text-yellow-600">G</span>roup and we represent a dynamic research group
              specializied in sports and esports management.
            </span>
            <p>
              Covering a diverse variety of topics our group brings together a team of researchers with a wide range of
              expertise.
            </p>
            <p>
              Our collaborative approach enables us to explore these themes comprehensively and develop innovative
              solutions across various domains within sports and esports management.
            </p>
          </div>
        </div>
        <div className={`${oxanium.className} w-full h-full flex justify-evenly text-neutral-800 md:w-full md:h-full`}>
          <button
            className="px-3 py-2 text-sm font-bold bg-yellow-600 rounded-lg md:text-lg md:hover:text-neutral-300 md:hover:border-neutral-800 active:text-neutral-300 hover:scale-110"
            onClick={() => router.push("/team")}
          >
            Check our team
          </button>

          <button
            className="px-3 py-2 text-sm font-bold bg-yellow-600 rounded-lg md:text-lg md:hover:text-neutral-300 md:hover:border-neutral-800 active:text-neutral-300 hover:scale-110"
            onClick={() => router.push("/projects")}
          >
            Check our projects
          </button>
        </div>
      </div>
    </div>
  );
}
