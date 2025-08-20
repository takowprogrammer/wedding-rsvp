"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const slides = [
    "/invitations/nude_warmth.png",
    "/invitations/phoenix_sand_radiance.png",
    "/invitations/dusty_blue_serenity.png",
    "/invitations/pure_white_elegance.png",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 via-phoenix-sand-50 to-dusty-blue-50">
      {/* Hero */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Slideshow images */}
        {slides.map((src, idx) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? "opacity-100" : "opacity-0"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Wedding invitation background"
              className="w-full h-full object-cover"
            />
            {/* Enhanced overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white/80" />
          </div>
        ))}

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 py-24">
          <h1 className="text-4xl md:text-5xl font-bold text-dusty-blue-800 tracking-tight mb-4 drop-shadow-lg">
            Celebrate Love, Seamlessly
          </h1>
          <p className="text-dusty-blue-700 max-w-2xl text-lg leading-relaxed drop-shadow-sm">
            Create and share beautiful invitations with embedded RSVP links. Effortless check-ins on the big day.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/admin/invitations/new"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-phoenix-sand-500 to-nude-500 hover:from-phoenix-sand-600 hover:to-nude-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              ✨ Share Invitation
            </Link>
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-nude-200/60 blur-2xl animate-pulse" />
        <div className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full bg-dusty-blue-200/60 blur-2xl animate-pulse" />
      </div>
    </div>
  );
}