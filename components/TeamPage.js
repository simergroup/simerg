"use client";

import Image from "next/image";
import { useState } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { oxanium } from "../utils/fonts";

export default function TeamPage({ team }) {
  return (
    <div className="flex flex-col max-w-4xl p-4 mx-auto space-y-8">
      <span
        className={`${oxanium.className} text-2xl text-yellow-600 font-bold uppercase tracking-wide`}
      >
        Our Team
      </span>

      <div className="space-y-2 text-neutral-300">
        <p>
          Meet our dedicated team members who are the driving force behind our
          projects.
        </p>
      </div>

      <Carousel members={team} />
    </div>
  );
}

function Carousel({ members }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? members.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === members.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {members.map((member) => (
          <div
            key={member._id}
            className="min-w-full p-4 rounded-lg bg-neutral-800"
          >
            <div className="flex items-center max-w-4xl mx-auto space-x-4 break-words">
              <div className="flex flex-col max-w-md space-y-4">
                <h3 className="mb-2 text-lg font-semibold text-yellow-400">
                  {member.name}
                </h3>
                <p className="text-neutral-300">{member.role}</p>
                <p className="text-sm text-neutral-300">{member.description}</p>
              </div>
              <Image
                src={
                  member.image ||
                  "https://pro-bel.com/wp-content/uploads/2019/11/blank-avatar-1-450x450.png"
                }
                alt={member.name}
                width={320}
                height={320}
                className="rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handlePrev}
        className="absolute left-0 p-2 text-yellow-500 transform -translate-y-1/2 rounded-full top-1/2 bg-neutral-700 hover:bg-neutral-600"
      >
        <FaAngleLeft />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 p-2 text-yellow-500 transform -translate-y-1/2 rounded-full top-1/2 bg-neutral-700 hover:bg-neutral-600"
      >
        <FaAngleRight />
      </button>
    </div>
  );
}
