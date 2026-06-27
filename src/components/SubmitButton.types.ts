import type { ReactNode } from "react";

export interface SubmitButtonProps {
	isLoading: boolean;
	className?: string;
	children: ReactNode;
}
