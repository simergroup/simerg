"use client";

import React, { useState } from "react";
import Image from "next/image";
import { NEWS } from "../utils/data";
import { oxanium } from "../utils/fonts";
import { FullscreenImage } from "./FullscreenImage"; // Importando a função

export default function NewsCard({ slug }) {
  const newsItem = NEWS.find((item) => item.slug === slug);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState("");

  const handleImageClick = (src) => {
    setFullscreenImage(src);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setFullscreenImage("");
  };

  if (!newsItem) {
    return <div>News item not found</div>;
  }

  return (
    <div className="flex flex-col max-w-3xl p-4 mx-auto text-neutral-300">
      <h1
        className={`${oxanium.className} text-2xl text-yellow-600 font-bold text-center uppercase tracking-wide p-2 mb-4`}
      >
        {newsItem.title}
      </h1>
      <p className="mb-6 text-sm text-center text-neutral-400">
        {new Date(newsItem.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <div className="text-justify">
        {typeof newsItem.content === "string" ? (
          <p className="indent-4">{newsItem.content}</p>
        ) : (
          Object.entries(newsItem.content).map(([key, paragraph], index) => (
            <React.Fragment key={key}>
              <p className="mb-4 indent-4">{paragraph}</p>
              {index === 0 &&
                newsItem.images &&
                newsItem.images[0] && ( // Exibe a primeira imagem após o primeiro parágrafo
                  <div className="relative w-full mb-4">
                    <Image
                      src={newsItem.images[0]}
                      alt={`${newsItem.title} - Image 1`}
                      layout="responsive"
                      width={400} // Largura base ajustada
                      height={250} // Altura base ajustada
                      objectFit="cover"
                      className="w-full h-auto max-w-md mx-auto rounded-lg cursor-pointer"
                      onClick={() => handleImageClick(newsItem.images[0])}
                    />
                  </div>
                )}
              {index === 2 &&
                newsItem.images &&
                newsItem.images[1] && ( // Exibe a segunda imagem após o terceiro parágrafo
                  <div className="relative w-full mb-4">
                    <Image
                      src={newsItem.images[1]}
                      alt={`${newsItem.title} - Image 2`}
                      layout="responsive"
                      width={400} // Largura base ajustada
                      height={250} // Altura base ajustada
                      objectFit="cover"
                      className="w-full h-auto max-w-md mx-auto rounded-lg cursor-pointer"
                      onClick={() => handleImageClick(newsItem.images[1])}
                    />
                  </div>
                )}
            </React.Fragment>
          ))
        )}
      </div>
      {isFullscreen && (
        <FullscreenImage
          src={fullscreenImage}
          alt="Fullscreen Image"
          onClose={closeFullscreen}
        />
      )}
    </div>
  );
}
