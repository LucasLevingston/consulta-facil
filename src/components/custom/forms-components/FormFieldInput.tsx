"use client";

import type { ControllerRenderProps } from "react-hook-form";
import { CustomInput } from "@/components/custom/custom-input";
import { FormControl } from "@/components/ui/form";
import { FormFieldType } from "./form-field-type";

// biome-ignore lint/suspicious/noExplicitAny: shared field component works with any form schema
type AnyField = ControllerRenderProps<any, string>;

interface Props {
	field: AnyField;
	fieldType: FormFieldType;
	type?: string;
	placeholder: string | undefined;
	disabled?: boolean;
}

export function FormFieldInput({
	field,
	fieldType,
	type,
	placeholder,
	disabled,
}: Props) {
	const inputType =
		fieldType === FormFieldType.EMAIL ? "email" : (type ?? "text");
	return (
		<FormControl>
			<CustomInput
				type={inputType}
				placeholder={placeholder}
				disabled={disabled}
				{...field}
			/>
		</FormControl>
	);
}
