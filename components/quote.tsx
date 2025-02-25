import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

export function Quote() {
  return (
    <div className="max-w-5xl  mx-auto px-4">
      <div className="w-full flex flex-col">
        <div className="relative flex pb-4 min-h-[750px] w-full flex-col items-center justify-center overflow-hidden">
          <p className="z-10 text-center text-4xl md:text-[48px] font-semibold leading-tight tracking-tight">
            Just knowing if a guest has already been at the property before, and
            greeting them with
            <span className="font-pacifico mx-3">‟Welcome back‟</span>
            is still very difficult for hotels to do consistently
          </p>
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
              "opacity-90"
            )}
          />
          <span className="text-lg font-medium text-muted-foreground px-4 md:px-0 md:w-2/3 mt-12 text-center">
            There are many of these small touches that can make a big impression
            on guests when done right, but the logistics of executing them
            consistently across an entire hotel staff are quite complex
          </span>

          <span className="text-lg font-medium text-muted-foreground w-2/3 mt-12 text-center">
            Our goal is to
            <span className="font-pacifico mx-2 text-3xl">fix</span> that
          </span>
        </div>
      </div>
    </div>
  );
}
