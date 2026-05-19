import * as React from "react"

import { cn } from "@/lib/utils"

function ChartContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chart"
      className={cn(
        "relative flex aspect-[2.8/1] w-full items-end overflow-hidden text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ChartValue({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chart-value"
      className={cn("text-4xl font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  )
}

export { ChartContainer, ChartValue }
