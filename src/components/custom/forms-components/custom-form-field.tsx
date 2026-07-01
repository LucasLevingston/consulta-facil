"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { CustomInput } from "@/components/custom/custom-input";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { getLabelByFormName } from "@/lib/utils/get-label-by-form-name";
import { getPlaceholderByFormName } from "@/lib/utils/get-placeholder-by-form-name";
import type { CustomFormFieldProps } from "./custom-form-field.types";
import { FormFieldDatePicker } from "./FormFieldDatePicker";
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
	const [showPassword, setShowPassword] = useState(false);
	const inputType =
		fieldType === FormFieldType.PASSWORD
			? showPassword
				? "text"
				: "password"
			: fieldType === FormFieldType.EMAIL
				? "email"
				: (type ?? "text");
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
						<FormControl>
							<CustomInput
								type={inputType}
								placeholder={finalPlaceholder}
								disabled={disabled}
								{...field}
							/>
						</FormControl>
					)}
					{fieldType === FormFieldType.PASSWORD && (
						<FormControl>
							<div className="relative">
								<CustomInput
									type={inputType}
									placeholder={finalPlaceholder}
									disabled={disabled}
									{...field}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
								>
									{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							</div>
						</FormControl>
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
