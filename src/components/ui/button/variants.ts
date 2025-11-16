import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs sm:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive/70 hover:bg-destructive/60 text-background shadow-xs focus-visible:ring-destructive/40 dark:focus-visible:ring-destructive/40 dark:bg-destructive/90 dark:hover:bg-destructive dark:text-foreground/90 dark:hover:text-foreground",
        outline:
          "border border-foreground/40 hover:border-foreground/60 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input/80 dark:hover:bg-input/40 dark:hover:border-input",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 disabled:opacity-75 disabled:bg-muted disabled:text-muted-foreground",
        input:
          "bg-secondary text-secondary-foreground shadow-xs border border-input hover:bg-secondary/80 disabled:opacity-75 disabled:bg-muted disabled:text-muted-foreground",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        "destructive-ghost":
          "hover:bg-accent text-destructive border border-transparent hover:border-destructive focus-visible:ring-destructive/20 dark:hover:bg-accent/50",
        icon: "text-secondary-foreground/90 hover:text-primary",
        link: "text-primary underline-offset-4 underline decoration-transparent hover:decoration-current",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        "icon-sm": "size-8",
        icon: "size-9",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
