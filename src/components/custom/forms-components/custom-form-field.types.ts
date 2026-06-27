import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { FormFieldType } from "./form-field-type";

export interface CustomFormFieldProps {
	// biome-ignore lint/suspicious/noExplicitAny: shared field component works with any form schema
	form: UseFormReturn<any, any, any>;
	name: string;
	label?: string;
	placeholder?: string;
	fieldType: FormFieldType;
	type?: string;
	disabled?: boolean;
	children?: ReactNode;
	className?: string;
	selectOptions?: { value: string; label: string }[];
}
