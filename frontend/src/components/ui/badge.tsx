import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-muted-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        accent: "bg-accent/10 text-accent",
        primary: "bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />
  )
}

export { Badge, badgeVariants }
