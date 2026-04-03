import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-500 text-white",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        gold: "border-gold-200 bg-gold-100 text-gold-700",
        teal: "border-teal-200 bg-teal-100 text-teal-700",
        green: "border-green-200 bg-green-100 text-green-700",
        blue: "border-blue-200 bg-blue-100 text-blue-700",
        red: "border-red-200 bg-red-100 text-red-700",
        purple: "border-purple-200 bg-purple-100 text-purple-700",
        orange: "border-orange-200 bg-orange-100 text-orange-700",
        gray: "border-gray-200 bg-gray-100 text-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
