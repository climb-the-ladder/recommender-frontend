'use client';

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
import { useRouter } from "next/navigation";
import { AuthDialog } from "@/components/auth-dialog";
import { useAuth } from "@/lib/hooks/useAuth";
import { useEffect } from 'react';

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, don't render anything while redirecting
  if (user) {
    return null;
  }

  return (
    <>
      <div className="h-16 w-full flex justify-between items-center px-8">
        <span className="font-bold text-xl">ClimbTheLadder</span>
        <div className="flex gap-4">
          <AuthDialog />
        </div>
      </div>
      <HeroSection />
      <SphereMask />
      <ProblemCopywriting />
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
