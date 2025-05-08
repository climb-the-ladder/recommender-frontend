"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface FloatingButtonProps {
  onClick: () => void;
  className?: string;
}

export function FloatingButton({ onClick, className }: FloatingButtonProps) {
  return (
    <Button
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-4 right-4 rounded-full shadow-lg w-12 h-12",
        className
      )}
      onClick={onClick}
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
} 