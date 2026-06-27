"use client";

import { Loading } from "@/components/custom/loading";
import { cn } from "@/lib/utils/cn";
import { CustomButton } from "../custom-button";
import type { CustomSubmitButtonProps } from "./custom-submit-button.types";

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
