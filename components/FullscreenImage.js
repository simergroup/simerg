import React from "react";
import Image from "next/image";

export const FullscreenImage = ({ src, alt, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 cursor-pointer backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <button
        onClick={onClose}
        className="absolute z-50 text-2xl text-white cursor-pointer top-4 right-4"
      >
        &times;
      </button>
      <div className="relative w-full h-full max-w-3xl cursor-default">
        <Image src={src} alt={alt} layout="fill" objectFit="contain" />
      </div>
    </div>
  );
};
