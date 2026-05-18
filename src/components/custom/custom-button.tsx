"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type CustomButtonProps = React.ComponentProps<typeof Button> & {
	variant?: "default" | "outline" | "destructive" | "secondary";
};

const baseStyles =
	"h-14 w-full min-w-32 max-w-[366px] rounded-full cursor-pointer font-semibold tracking-wide transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants = {
	default: cn(
		"bg-gradient-to-r from-primary via-primary to-secondary",
		"text-white",
		"shadow-lg shadow-primary/25",
		"hover:scale-[1.02]",
		"hover:brightness-110",
		"hover:shadow-xl hover:shadow-primary/40",
		"dark:hover:shadow-primary/30"
	),

	outline: cn(
		"border border-primary/40 bg-background/70 backdrop-blur-md",
		"text-primary",
		"hover:border-primary",
		"hover:bg-primary/10",
		"hover:text-primary",
		"hover:shadow-lg hover:shadow-primary/20",
		"dark:bg-muted/20"
	),

	destructive: cn(
		"bg-gradient-to-r from-red-500 via-red-600 to-red-700",
		"text-white",
		"shadow-lg shadow-red-500/20",
		"hover:brightness-110",
		"hover:shadow-xl hover:shadow-red-500/40",
		"hover:scale-[1.02]"
	),

	secondary: cn(
		"bg-gradient-to-r from-secondary to-secondary/80",
		"text-secondary-foreground",
		"shadow-lg shadow-secondary/20",
		"hover:brightness-110",
		"hover:shadow-xl hover:shadow-secondary/40",
		"hover:scale-[1.02]"
	),
};

export const CustomButton = ({
	className,
	children,
	variant = "default",
	...props
}: CustomButtonProps) => {
	return (
		<Button
			{...props}
			className={cn(baseStyles, variants[variant], className)}
		>
			{children}
		</Button>
	);
};