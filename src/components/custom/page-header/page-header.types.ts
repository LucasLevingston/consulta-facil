import type { ReactNode } from "react";

export interface PageHeaderProps {
	title: string;
	description: string;
	count?: number;
	countLabel?: string;
	icon?: ReactNode;
}
