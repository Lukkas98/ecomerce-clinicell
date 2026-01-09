"use client";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

const noImage = "https://dummyimage.com/2000x2000?text=Sin+Imagen";
// "https://fakeimg.pl/450x450/c2c2c2/808080?text=Sin+Imagen&font=bebas";

function Carousel({ images = [] }) {
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
      className="relative h-full w-full overflow-hidden rounded-xl border border-gray-950"
      data-carousel="slide"
    >
      <div className="relative overflow-hidden">
        {images.map((img, i) => (
          <div
            key={i}
            className={`relative aspect-square w-full bg-transparent ${
              currentSlide === i + 1 ? "" : "hidden"
            }`}
            data-carousel-item
          >
            <Image
              src={img?.url ?? noImage}
              className="block w-full bg-gray-700 object-contain"
              alt="..."
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 400px, 500px"
              quality={100}
              priority={true}
            />
          </div>
        ))}
        {!images.length && (
          <Image
            src={noImage}
            height={450}
            width={450}
            alt="no image"
            className="mx-auto"
          />
        )}
      </div>
      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse">
        {images?.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`h-3 w-3 rounded-full ${
              currentSlide === i + 1 ? "bg-blue-500" : "bg-gray-800"
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
          className="group absolute start-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center focus:outline-none"
          data-carousel-prev
          onClick={prevSlide}
        >
          <ArrowLeftCircleIcon width={40} height={40} className="text-black" />
        </button>
      )}
      {currentSlide > 0 && currentSlide < images.length && (
        <button
          type="button"
          className="group absolute end-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center focus:outline-none"
          data-carousel-next
          onClick={nextSlide}
        >
          <ArrowRightCircleIcon width={40} height={40} className="text-black" />
        </button>
      )}
    </div>
  );
}

export default Carousel;
