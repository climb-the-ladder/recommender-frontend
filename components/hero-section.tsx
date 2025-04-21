"use client";

import Link from "next/link";
import Particles from "@/components/particles";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8 overflow-hidden"
    >
      <Particles
        className="absolute inset-0 z-[-1] h-full w-full" // Lower z-index to ensure it’s behind everything
        quantity={200}
        ease={30}
        color="#FF6B6B"
        size={0.8}
        staticity={30}
        vx={0.05}
        vy={-0.05}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[60vh] text-white">
        <h1 className="mx-auto max-w-4xl text-balance text-center text-4xl font-bold tracking-tight sm:text-6xl animate-fade-in">
          Climb the Ladder to Your Dream Career
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-300 sm:text-xl/8 animate-slide-up">
          Discover the career paths that match your skills, interests, and
          potential with our AI-powered prediction tool.
        </p>
        <Link
          href="/predict"
          className="mt-8 inline-block rounded-full bg-white/10 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:bg-white/20 backdrop-blur-md transition-all duration-300 animate-pulse-slow"
        >
          Predict My Career Now
        </Link>
      </div>
    </section>
  );
}
