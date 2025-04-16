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
      className="relative w-full h-[400px] bg-gray-700 rounded-lg overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${images[currentImage]})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <h1
          className="text-4xl lg:text-6xl font-bold bg-gradient-to-r
         from-blue-300 to-cyan-500 bg-clip-text text-transparent animate-bounce"
        >
          ¡Reparación & Tecnología al Alcance!
        </h1>
      </div>
      <div className="absolute -top-10 -left-10 w-1/4 h-1/4 bg-blue-500 rotate-12 opacity-70"></div>
      <div className="absolute bottom-5 right-10 w-1/3 h-1/3 bg-cyan-400 rotate-6 opacity-50"></div>
    </section>
  );
}
