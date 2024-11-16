"use client";
import Image from "next/image";
import React, { useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import { PARTNERS } from "../../utils/data";
import { oxanium } from "../../utils/fonts";

export default function Partners() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? PARTNERS.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === PARTNERS.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="flex flex-col items-center gap-5 mx-auto lg:flex-row">
      {/* Left Container / Image Slider */}
      <div className="relative items-center gap-5 lg:flex-col group">
        <div className="px-4 space-y-2">
          <div className="space-y-1 text-yellow-600">
            <p
              className={`${oxanium.className} text-center text-yellow-600 text-3xl tracking-wider uppercase font-bold`}
            >
              Meet our partners
            </p>
          </div>
          <Image
            src={PARTNERS[currentIndex].image}
            alt={PARTNERS[currentIndex].name + " Slide picture"}
            className="object-contain p-4 shadow-lg w-[360px] h-[280px] rounded-xl border border-neutral-600"
          />

          {/* Image Index Display */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              {PARTNERS.map((slide, slideIndex) => (
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

      {/* Right Container / Text and Projects */}
      <div className="flex flex-col w-full p-4 space-y-2 text-justify md:max-w-xl indent-4 text-neutral-300 md:text-base">
        <p
          className={`${oxanium.className} text-xl text-center font-bold text-yellow-600 lg:text-3xl`}
        >
          {PARTNERS[currentIndex].name}
        </p>
        <p>{PARTNERS[currentIndex].paragraph1}</p>
        <p>{PARTNERS[currentIndex].paragraph2}</p>
        <p>{PARTNERS[currentIndex].paragraph3}</p>
      </div>
    </div>
  );
}
