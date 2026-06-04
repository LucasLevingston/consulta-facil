"use client";

import type React from "react";
import type { UseFormReturn } from "react-hook-form";
import { Loading } from "@/components/custom/loading";
import { cn } from "@/lib/utils/cn";
import { CustomButton } from "../custom-button";

interface CustomSubmitButtonProps {
	isSubmitting?: boolean;
	isDirty?: boolean;
	children: React.ReactNode;
	submittingText?: string;
	className?: string;
	disabled?: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: shared submit button works with any form schema
	form?: UseFormReturn<any, any, any>;
}

export function CustomSubmitButton({
	isSubmitting,
	isDirty = true,
	children,
	submittingText = "Enviando...",
	disabled,
	form,
	className,
}: CustomSubmitButtonProps) {
	return (
		<CustomButton
			disabled={isSubmitting || !isDirty || disabled}
			type="submit"
			className={cn("w-full", className)}
		>
			{form?.formState.isSubmitting || isSubmitting ? (
				<>
					<Loading />
					{submittingText}
				</>
			) : (
				children
			)}
		</CustomButton>
	);
}
