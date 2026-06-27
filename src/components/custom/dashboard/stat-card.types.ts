import type { ReactNode } from "react";

export interface StatCardProps {
	icon: ReactNode;
	count: number;
	label: string;
	colorClass: string;
}
