import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Badge } from "./Badge.vue";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        primary: "bg-accent border-accent text-primary",
        success: "bg-green-500/10 text-green-600 border-green-500/10",
        pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/10",
        warning: "bg-orange-500/10 text-orange-600 border-orange-500/10",
        danger: "bg-red-500/10 text-red-600 border-red-500/10",
        info: "bg-blue-500/10 text-blue-600 border-blue-500/10",
        neutral:
          "bg-gray-500/10 dark:bg-gray-600/20 text-gray-600 dark:text-gray-400 border-gray-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
export type BadgeVariants = VariantProps<typeof badgeVariants>;
