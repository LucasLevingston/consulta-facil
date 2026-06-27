import type { ComponentProps } from "react";
import type { Button } from "../ui/button";

export type CustomButtonProps = ComponentProps<typeof Button> & {
	variant?: "default" | "outline" | "destructive" | "secondary" | "ghost";
};
