import type { ReactNode } from "react";

export interface PaymentResultProps {
	icon: ReactNode;
	title: string;
	description: ReactNode;
	buttonLabel: string;
	buttonHref: string;
	buttonVariant?: "default" | "outline";
}
