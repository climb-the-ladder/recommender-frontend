import React from "react";
import { Separator } from "./ui/separator";
import { PlusIcon } from "lucide-react";

export function Card({ title, kit, description }: any) {
  return (
    <div className="mx-auto p-[4px] border w-full rounded-[27px] bg-muted/50 shadow col-span-3 md:col-span-1">
      <div className="border w-full border-dashed h-[400px] rounded-3xl bg-background/60">
        <div className="p-4">
          <div className="flex flex-col space-y-6">
            <div className="flex w-full justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground font-semibold">
                  {title}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold">{kit}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">Free</span>
                <span className="text-[10px] text-muted-foreground font-medium text-end">
                  Instant Access
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full flex-1">
              <span className="text-[10px] text-muted-foreground font-medium">
                Description
              </span>
              <span className="text-xs font-medium">{description}</span>
            </div>
          </div>
          <Separator className="my-4 opacity-60" />
          <div>
            <span className="text-xs text-muted-foreground">
              What&apos;s included
            </span>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-sm font-medium flex items-center gap-1">
                <PlusIcon size={12} className="text-muted-foreground" />
                Personalized career predictions
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
