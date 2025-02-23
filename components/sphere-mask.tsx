import { cn } from "@/lib/utils";

export const SphereMask = ({ reverse = false }: { reverse?: boolean }) => {
  return (
    <div
      className={cn(
        // Base styling
        "pointer-events-none relative -z-[2] mx-auto h-[50rem] overflow-hidden", // Keeping original height

        // Bluish sphere mask with subtle transparency
        "[mask-image:radial-gradient(ellipse_at_center_center,#ffffff,transparent_50%)]",

        // Reverse positioning (keeping original offsets)
        reverse ? "my-[-22rem] rotate-180 md:mt-[-30rem]" : "my-[-18.8rem]",

        // Before: Subdued bluish gradient background
        "before:absolute before:inset-0 before:h-full before:w-full before:opacity-40 before:[background-image:radial-gradient(circle_at_bottom_center, #2D4A75, #5D8AA8, #A2CFFE, transparent_70%)]",

        // After: Larger bluish glowing orb with subtle shadow
        "after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[50%] after:bg-gradient-to-br after:from-[#2D4A75]/30 after:to-[#5D8AA8]/30 after:border-t after:border-[#A2CFFE]/20 after:shadow-[0_0_15px_5px_rgba(45,74,117,0.2)]"
      )}
    ></div>
  );
};
