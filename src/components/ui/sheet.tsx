"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  side = "end",
  className,
  children,
  title,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog.Content> & {
  side?: "start" | "end" | "bottom";
  title?: string;
}) {
  const sideClasses =
    side === "bottom"
      ? "inset-x-0 bottom-0 h-[85dvh] rounded-t-[var(--radius-xl)] data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom"
      : side === "start"
        ? "inset-y-0 start-0 h-dvh w-full max-w-md data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left rtl:data-[state=open]:slide-in-from-right rtl:data-[state=closed]:slide-out-to-right"
        : "inset-y-0 end-0 h-dvh w-full max-w-md data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right rtl:data-[state=open]:slide-in-from-left rtl:data-[state=closed]:slide-out-to-left";

  return (
    <Dialog.Portal>
      {/* A modal task dims what it covers, so the page reads as pushed back. */}
      <Dialog.Overlay
        className={cn(
          "fixed inset-0 z-[var(--z-overlay)] bg-[var(--scrim)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "duration-[var(--duration-sheet)] ease-[var(--ease-sheet)]",
        )}
      />
      <Dialog.Content
        className={cn(
          "fixed z-[var(--z-modal)] flex flex-col bg-bg shadow-[var(--shadow-pop)] focus:outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "duration-[var(--duration-sheet)] ease-[var(--ease-sheet)]",
          sideClasses,
          className,
        )}
        {...props}
      >
        <Dialog.Title className={title ? "sr-only" : "hidden"}>
          {title ?? "Panel"}
        </Dialog.Title>
        {children}
        <Dialog.Close
          className={cn(
            "absolute end-4 top-4 grid size-9 place-items-center rounded-full text-muted",
            "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)]",
            "hover:bg-surface hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          )}
        >
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
