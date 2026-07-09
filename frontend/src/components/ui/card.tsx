import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-[22px] border border-border/60 bg-card text-card-foreground shadow-[0_4px_18px_-8px_rgba(43,38,32,0.12)]",
        className
      )}
      {...props}
    />
  )
}

export { Card }
