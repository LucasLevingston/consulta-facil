import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";

export interface CustomSubmitButtonProps {
	isSubmitting?: boolean;
	isDirty?: boolean;
	children: ReactNode;
	submittingText?: string;
	className?: string;
	disabled?: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: shared submit button works with any form schema
	form?: UseFormReturn<any, any, any>;
}
