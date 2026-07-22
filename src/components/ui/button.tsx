import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Solid ink pills. No gradients, no glow — the fill carries the hierarchy and
// the press gives the feedback. `active:scale` is the only motion, at 120ms,
// because a button press must be felt before it is seen.
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-pill)]",
    "font-medium tracking-[-0.01em]",
    "transition-[background-color,color,border-color,opacity,transform]",
    "duration-[var(--duration-hover)] ease-[var(--ease-out)]",
    "active:scale-[0.97] active:duration-[var(--duration-press)]",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-fg hover:opacity-85",
        accent: "bg-accent text-accent-fg hover:bg-accent-strong",
        outline: "border border-fg/25 bg-transparent text-fg hover:bg-fg/5",
        ghost: "bg-transparent text-fg hover:bg-fg/5",
        surface: "border border-border bg-surface text-fg hover:bg-surface-2",
        // Text-only action, the way a secondary link sits next to a CTA.
        link: "h-auto rounded-none px-0 text-accent underline-offset-4 hover:underline",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        /** @deprecated alias kept so the admin back office keeps compiling. */
        gold: "bg-primary text-primary-fg hover:opacity-85",
      },
      size: {
        sm: "h-9 px-4 text-[0.875rem]",
        md: "h-11 px-6 text-[0.9375rem]",
        lg: "h-[3.25rem] px-8 text-[1.0625rem]",
        icon: "h-11 w-11 px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
