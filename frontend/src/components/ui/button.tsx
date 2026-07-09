import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border font-semibold whitespace-nowrap transition-all outline-none select-none active:not-aria-[haspopup]:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-3 focus-visible:ring-ring/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-primary text-primary-foreground shadow-[0_8px_20px_-6px_rgba(107,191,89,0.55)] hover:bg-primary/90",
        secondary:
          "border-primary bg-card text-primary hover:bg-secondary/60",
        danger: "border-transparent bg-accent text-accent-foreground hover:bg-accent/90",
        ghost: "border-transparent text-foreground hover:bg-muted",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 text-sm",
        lg: "h-14 w-full px-6 text-base",
        sm: "h-9 px-4 text-xs",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  render,
  nativeButton,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      render={render}
      // `render` almost always swaps in a non-<button> element here (a Next
      // Link, most commonly) - default nativeButton to false in that case
      // so Base UI doesn't warn about losing native button semantics.
      nativeButton={nativeButton ?? !render}
      {...props}
    />
  )
}

export { Button, buttonVariants }
