"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { FaFile } from "react-icons/fa";
import { RxDotFilled } from "react-icons/rx";
import { oxanium } from "../../utils/fonts";
import {
  MASTER_PROJECTS,
  RESEARCH_PROJECTS,
  PHD_PROJECTS,
  TEAM,
} from "../../utils/data";

export default function Team() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? TEAM.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === TEAM.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  const teamMember = TEAM[currentIndex];

  const getProjectNames = () => {
    const projects = [
      ...MASTER_PROJECTS,
      ...RESEARCH_PROJECTS,
      ...PHD_PROJECTS,
    ];
    const matchingProjects = projects.filter(
      (project) =>
        project.author === teamMember.name ||
        project.professorAdvisor === teamMember.name
    );
    return matchingProjects.map((project) => project.title);
  };

  return (
    <div className="flex flex-col items-center gap-5 mx-auto lg:flex-row">
      {/* Left Container / Image Slider */}
      <div className="relative flex items-center gap-5 lg:flex-col group">
        <div className="px-4 space-y-2">
          <div className="space-y-1 text-yellow-600">
            <p
              className={`${oxanium.className} text-center text-yellow-600 text-3xl tracking-wider uppercase font-bold`}
            >
              Meet our team
            </p>
          </div>
          <Image
            src={teamMember.image}
            alt={teamMember.name + " Slide picture"}
            className="object-cover object-top shadow-lg w-[360px] h-[280px] rounded-xl border border-neutral-600"
          />
          {/* Image Index Display */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              {TEAM.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className={
                    currentIndex === slideIndex
                      ? "text-3xl cursor-pointer text-yellow-600"
                      : "text-xl cursor-pointer text-neutral-300/80"
                  }
                >
                  <RxDotFilled />
                </div>
              ))}
            </div>
            <div className="flex gap-4 px-2">
              {/* Left Arrow */}
              <div className="cursor-pointer">
                <BsChevronCompactLeft
                  onClick={prevSlide}
                  className="p-1 rounded-full size-6 bg-neutral-300/80"
                />
              </div>
              {/* Right Arrow */}
              <div className="cursor-pointer">
                <BsChevronCompactRight
                  onClick={nextSlide}
                  className="p-1 rounded-full size-6 bg-neutral-300/80"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Container / About and Projects */}
      <div className="flex flex-col w-full p-4 md:max-w-xl">
        <p
          className={`${oxanium.className} text-xl text-center font-bold py-2 text-yellow-600 lg:text-3xl`}
        >
          {teamMember.name} - {teamMember.position}
        </p>
        <div className="w-full h-full space-y-2">
          <p className="text-neutral-300 md:text-base indent-4">
            {teamMember.paragraph1}
          </p>
          <p className="text-neutral-300 md:text-base indent-4">
            {teamMember.paragraph2}
          </p>
          <p className="text-neutral-300 md:text-base indent-4">
            {teamMember.paragraph3}
          </p>
        </div>
        {getProjectNames().length > 0 ? (
          <div className="py-2 space-y-2">
            <h1 className={`${oxanium.className} font-bold text-yellow-600`}>
              Projects:
            </h1>
            <ul className="flex flex-row flex-wrap gap-2">
              {getProjectNames().map((project) => (
                <li
                  className="flex items-center gap-1 px-2 py-1 rounded text-neutral-300 bg-neutral-700 border-neutral-300"
                  key={project}
                >
                  <FaFile />
                  <span className="text-sm truncate max-w-32">{project}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <span className={`${oxanium.className} text-sm text-yellow-600 py-2`}>
            No projects to be displayed... Yet!
          </span>
        )}
      </div>
    </div>
  );
}
