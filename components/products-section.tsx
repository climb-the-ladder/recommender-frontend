import { GlowEffect } from "@/components/glow-effect";
import { CheckIcon } from "lucide-react";

const tier = {
  name: "Climb the Ladder",
  id: "Career Prediction Tool",
  href: "/predict",
  description:
    "Our AI analyzes your GPA, activities, and interests to predict your most likely career paths.",
  features: [
    "Personalized career predictions",
    "Instant results powered by machine learning",
    "Tailored guidance for high school students",
    "Free access—no strings attached",
  ],
  featured: true,
};

export const ProductsSection = () => {
  return (
    <div className="relative mt-24 isolate bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="relative z-10">
        <h2 className="mx-auto max-w-4xl text-balance text-center text-5xl font-semibold tracking-tight text-white sm:text-6xl">
          Built for Students Ready to Climb
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-400 sm:text-xl/8">
          No confusion. No guesswork. Just a smart tool to map your future.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl">
        <div
          key={tier.id}
          className="rounded-3xl relative bg-background shadow-2xl border p-8 ring-1 ring-gray-900/10 sm:p-10"
        >
          <div>
            <span className="text-sm font-semibold text-muted-foreground">
              {tier.id}
            </span>
            <h3 id={tier.id} className="text-base/7 font-semibold text-white">
              {tier.name}
            </h3>
          </div>
          <p className="text-gray-300 mt-6 text-base/7">{tier.description}</p>
          <ul
            role="list"
            className="text-gray-300 mt-8 space-y-3 text-sm/6 sm:mt-10"
          >
            {tier.features.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon
                  aria-hidden="true"
                  className="text-indigo-400 h-6 w-5 flex-none"
                />
                {feature}
              </li>
            ))}
          </ul>
          <a
            href={tier.href}
            className="w-full mt-8 sm:mt-10 inline-flex items-center justify-center rounded-md bg-[#276EF0] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#276EF0]/95"
          >
            Get Started
          </a>
        </div>
      </div>

      <GlowEffectCardBackground />
    </div>
  );
};

export function GlowEffectCardBackground() {
  return (
    <div className="relative md:w-1/2 lg:w-1/3 mx-auto mt-32 -mb-12">
      <GlowEffect
        colors={["#61D37D", "#FFBE4C", "#276EF0"]}
        mode="static"
        blur="medium"
      />
      <div className="rounded-3xl relative bg-background shadow-2xl border p-8 ring-1 ring-gray-900/10 sm:p-10">
        <div>
          <span className="text-sm font-semibold text-muted-foreground">
            Free Access
          </span>
          <h3 className="text-white text-base/7 font-semibold">
            Start Climbing Today
          </h3>
        </div>
        <p className="text-gray-300 mt-6 text-base/7">
          Try Climb the Ladder for free and see where your future could lead.
        </p>
        <a
          href="/predict"
          className="w-full mt-8 sm:mt-10 inline-flex items-center justify-center rounded-md bg-[#276EF0] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#276EF0]/95"
        >
          Predict Now
        </a>
      </div>
    </div>
  );
}
