import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-[rgba(0,102,186,0.1)] text-[#0066BA] border border-[rgba(0,102,186,0.25)]",
        success:     "bg-[rgba(22,163,74,0.1)] text-[#16a34a] border border-[rgba(22,163,74,0.25)]",
        warning:     "bg-[rgba(180,83,9,0.1)] text-[#b45309] border border-[rgba(180,83,9,0.25)]",
        destructive: "bg-[rgba(237,29,50,0.1)] text-[#ED1D32] border border-[rgba(237,29,50,0.25)]",
        outline:     "border border-[#c8d8ea] text-[#445574]",
        secondary:   "bg-[#eef3fa] text-[#445574]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
