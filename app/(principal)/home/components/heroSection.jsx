"use client";
import { useState, useEffect } from "react";

const images = [
  "/images/trabajo1.webp",
  "/images/trabajo2.webp",
  "/images/trabajo3.webp",
  "/images/trabajo4.webp",
];

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Cambia cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="animate-zoomBg relative h-100 w-full overflow-hidden rounded-lg bg-gray-700 bg-cover bg-center"
      style={{ backgroundImage: `url(${images[currentImage]})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <h1 className="animate-bounce bg-linear-to-r from-blue-300 to-cyan-500 bg-clip-text text-4xl font-bold text-transparent lg:text-6xl">
          ¡Reparación & Tecnología!
        </h1>
      </div>
      <div className="absolute -top-4 -left-3 h-1/4 w-1/4 rotate-12 bg-blue-500/70"></div>
      <div className="absolute -right-5 -bottom-8 h-1/3 w-1/3 rotate-6 bg-cyan-400/60"></div>
    </section>
  );
}
