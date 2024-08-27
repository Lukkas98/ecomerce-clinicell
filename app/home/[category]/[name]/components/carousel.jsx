"use client";
import Image from "next/image";
import { useState } from "react";
import defaultImage from "@/public/default.svg";

import a_left from "../assets/left.svg";
import a_rigth from "../assets/rigth.svg";

function Carousel({ images }) {
  const [currentSlide, setCurrentSlide] = useState(1);

  const nextSlide = () => {
    if (currentSlide >= images.length) setCurrentSlide(images.length);
    else setCurrentSlide((value) => value + 1);
  };

  const prevSlide = () => {
    if (currentSlide <= 1) setCurrentSlide(1);
    else setCurrentSlide((value) => value - 1);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div
      id="default-carousel"
      className="relative w-full max-w-lg h-full"
      data-carousel="slide"
    >
      <div className="relative overflow-hidden rounded-lg">
        {images?.map((img, i) => (
          <div
            key={i}
            className={`duration-700 relative max-w-lg aspect-square w-full ease-in-out ${
              currentSlide === i + 1 ? "" : "hidden"
            }`}
            data-carousel-item
          >
            <Image
              src={img ?? "https://via.placeholder.com/400"}
              className="absolute block w-full"
              alt="..."
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 512px"
              quality={100}
            />
          </div>
        ))}
        {!images.length && (
          <Image
            src={defaultImage}
            height={100}
            width={100}
            alt="no image"
            className="mx-auto"
          />
        )}
      </div>
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {images?.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`w-3 h-3 rounded-full ${
              currentSlide === i + 1 ? "bg-white" : "bg-gray-400"
            }`}
            aria-current={currentSlide === i ? "true" : "false"}
            aria-label={`Slide ${i + 1}`}
            onClick={() => goToSlide(i + 1)}
            data-carousel-slide-to={i + 1}
          ></button>
        ))}
      </div>
      {currentSlide > 1 && (
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none"
          data-carousel-prev
          onClick={prevSlide}
        >
          <Image src={a_left} width={20} height={20} alt="pagination" />
        </button>
      )}
      {currentSlide > 0 && currentSlide < images.length && (
        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none"
          data-carousel-next
          onClick={nextSlide}
        >
          <Image src={a_rigth} width={20} height={20} alt="pagination" />
        </button>
      )}
    </div>
  );
}

export default Carousel;
