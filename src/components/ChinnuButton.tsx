"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react"; // Correct import type
import { forwardRef } from "react";

// Use React.ButtonHTMLAttributes for full button props
interface ChinnuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // onClick is already part of ButtonHTMLAttributes
}

const ChinnuButton = forwardRef<HTMLButtonElement, ChinnuButtonProps>(
  ({ className, onClick, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        onClick={onClick}
        className={cn(
          "font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl", // Responsive large text
          "h-52 w-52 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80 xl:h-[22rem] xl:w-[22rem]", // Responsive large button size
 "rounded-[3rem]", // Squircle shape
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90",
          "shadow-2xl", // Pulsing animation and shadow from tailwind.config.ts
          "transition-all duration-300 ease-in-out",
          "transform hover:scale-105 active:scale-95", // Slight scale on hover and active
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-opacity-75", // Enhanced focus visibility
          className
        )}
        {...props}
      >
        Chinnu
      </Button>
    );
  }
);
ChinnuButton.displayName = "ChinnuButton";

export { ChinnuButton };
