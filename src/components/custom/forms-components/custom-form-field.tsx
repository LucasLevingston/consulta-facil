"use client";

import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { getLabelByFormName } from "@/lib/utils/get-label-by-form-name";
import { getPlaceholderByFormName } from "@/lib/utils/get-placeholder-by-form-name";
import type { CustomFormFieldProps } from "./custom-form-field.types";
import { FormFieldDatePicker } from "./FormFieldDatePicker";
import { FormFieldInput } from "./FormFieldInput";
import { FormFieldPassword } from "./FormFieldPassword";
import { FormFieldSelect } from "./FormFieldSelect";
import { FormFieldTextarea } from "./FormFieldTextarea";
import { FormFieldType } from "./form-field-type";

export { FormFieldType } from "./form-field-type";

export default function CustomFormField({
	form,
	name,
	label,
	placeholder,
	fieldType,
	type,
	disabled,
	className,
	selectOptions,
}: CustomFormFieldProps) {
	const finalLabel = label === "" ? "" : (label ?? getLabelByFormName(name));
	const finalPlaceholder = placeholder ?? getPlaceholderByFormName(name);
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					{fieldType !== FormFieldType.CHECKBOX && finalLabel && (
						<FormLabel className="text-sm font-semibold text-primary">
							{finalLabel}
						</FormLabel>
					)}
					{(fieldType === FormFieldType.INPUT ||
						fieldType === FormFieldType.EMAIL) && (
						<FormFieldInput
							field={field}
							type={type}
							fieldType={fieldType}
							placeholder={finalPlaceholder}
							disabled={disabled}
						/>
					)}
					{fieldType === FormFieldType.PASSWORD && (
						<FormFieldPassword
							field={field}
							placeholder={finalPlaceholder}
							disabled={disabled}
						/>
					)}
					{fieldType === FormFieldType.TEXTAREA && (
						<FormFieldTextarea
							field={field}
							placeholder={finalPlaceholder}
							disabled={disabled}
							className={className}
						/>
					)}
					{fieldType === FormFieldType.SELECT && (
						<FormFieldSelect
							field={field}
							placeholder={finalPlaceholder}
							disabled={disabled}
							selectOptions={selectOptions}
						/>
					)}
					{fieldType === FormFieldType.DATE_PICKER && (
						<FormFieldDatePicker
							field={field}
							placeholder={finalPlaceholder}
							disabled={disabled}
						/>
					)}
					<FormMessage className="text-xs text-destructive" />
				</FormItem>
			)}
		/>
	);
}
