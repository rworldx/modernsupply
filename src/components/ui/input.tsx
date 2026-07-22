import * as React from "react";
import { cn } from "@/lib/utils";

// Fields sit *into* the page rather than floating on it: filled surface, hairline
// border, no shadow. The focus ring is the only colour they carry.
const field = [
  "w-full rounded-[var(--radius-md)] border border-border bg-surface",
  "text-[1.0625rem] text-fg placeholder:text-muted",
  "transition-[border-color,background-color] duration-[var(--duration-hover)] ease-[var(--ease-out)]",
  "focus-visible:outline-none focus-visible:border-fg/40 focus-visible:ring-2 focus-visible:ring-accent/45",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(field, "h-12 px-4", className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(field, "min-h-28 px-4 py-3 leading-relaxed", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";
