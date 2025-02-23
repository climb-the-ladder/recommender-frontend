import { ProblemCopywriting } from "../components/problem-copywriting";
import { SolutionCopywriting } from "../components/solution-copywriting";
import { GapSection } from "../components/gap-section";
import { HeroSection } from "../components/hero-section";
import { LeadMagnet } from "../components/lead-magnet";
import Particles from "../components/particles";
import { ProductsSection } from "../components/products-section";
import { SphereMask } from "../components/sphere-mask";
import { Button, buttonVariants } from "@/components/ui/button";
import { FAQ } from "../components/faq";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <>
      <div className="h-16 w-full flex  ">
        <span className="font-bold font-xl p-8">ClimbTheLadder</span>
      </div>
      <HeroSection />
      <SphereMask />
      <ProblemCopywriting />
      {/* <Separator className="mx-auto w-1/2" /> */}
      <LeadMagnet />
      <GapSection />
      <ProductsSection />
      <FAQ />
      <SolutionCopywriting />

      <div className="mx-auto w-full flex flex-col justify-center gap-4 my-16">
        <a
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "flex mx-auto"
          )}
          href="mailto:contact@climbtheladder.com"
        >
          Contact
        </a>
        <span className="mt-2 mx-auto">© 2025. ClimbTheLadder.</span>
      </div>

      <Particles
        className="absolute inset-0 -z-10"
        quantity={50}
        ease={70}
        size={0.05}
        staticity={40}
        color={"#ffffff"}
      />
    </>
  );
}
