"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import { oxanium } from "../../utils/fonts";
import Link from "next/link";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const response = await fetch('/api/partners');
        if (!response.ok) throw new Error('Failed to fetch partners');
        const data = await response.json();
        setPartners(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPartners();
  }, []);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? partners.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === partners.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  if (loading) {
    return <div className="text-center text-neutral-300">Loading partners...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!partners.length) {
    return <div className="text-center text-neutral-300">No partners found</div>;
  }

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
            src={partners[currentIndex].logo}
            alt={partners[currentIndex].name + " logo"}
            className="object-contain p-4 shadow-lg w-[360px] h-[280px] rounded-xl border border-neutral-600"
            width={360}
            height={280}
          />

          {/* Image Index Display */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              {partners.map((partner, slideIndex) => (
                <Link
                  href={`/partners/${partner.slug}`}
                  key={partner._id}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  <div
                    onClick={() => goToSlide(slideIndex)}
                    className={`text-2xl cursor-pointer ${
                      currentIndex === slideIndex ? "text-yellow-600" : "text-neutral-300"
                    }`}
                  >
                    <RxDotFilled />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Left Arrow */}
        <div
          onClick={prevSlide}
          className="absolute left-5 top-[50%] -translate-x-0 translate-y-[-50%] text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
        >
          <BsChevronCompactLeft size={30} />
        </div>
        {/* Right Arrow */}
        <div
          onClick={nextSlide}
          className="absolute right-5 top-[50%] -translate-x-0 translate-y-[-50%] text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
        >
          <BsChevronCompactRight size={30} />
        </div>
      </div>

      {/* Right Container / Description */}
      <div className="flex flex-col items-center gap-5 lg:flex-col">
        <div className="px-4 space-y-2">
          <div className="space-y-1">
            <p className={`${oxanium.className} text-yellow-600 text-2xl tracking-wider uppercase font-bold`}>
              {partners[currentIndex].name}
            </p>
            <p className="text-justify text-neutral-300 text-base">
              {partners[currentIndex].description}
            </p>
            {partners[currentIndex].website && (
              <a
                href={partners[currentIndex].website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-yellow-600 hover:text-yellow-500"
              >
                Visit Website →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
