
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onClick, onTouchStart, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
      // Ensure focus on mobile devices
      const target = e.currentTarget;
      target.focus();
      
      // Call the original onClick if provided
      if (onClick) {
        onClick(e);
      }
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLTextAreaElement>) => {
      // Ensure focus on mobile touch
      const target = e.currentTarget;
      target.focus();
      
      // Call the original onTouchStart if provided
      if (onTouchStart) {
        onTouchStart(e);
      }
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
