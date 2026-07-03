import type { ReactNode } from "react";

export interface ThemeOptionProps {
	value: string;
	label: string;
	currentValue: string;
	children: ReactNode;
}
