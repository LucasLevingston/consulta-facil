"use client";

import { format } from "date-fns";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { CustomInput } from "@/components/custom/custom-input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn, getLabelByFormName, getPlaceholderByFormName } from "@/lib/utils";
export enum FormFieldType {
	INPUT = "input",
	EMAIL = "email",
	PASSWORD = "password",
	TEXTAREA = "textarea",
	CHECKBOX = "checkbox",
	SELECT = "select",
	DATE_PICKER = "date-picker",
}

interface CustomFormFieldProps {
	// biome-ignore lint/suspicious/noExplicitAny: shared field component works with any form schema
	form: UseFormReturn<any, any, any>;
	name: string;
	label?: string;
	placeholder?: string;
	fieldType: FormFieldType;
	type?: string;
	disabled?: boolean;
	children?: React.ReactNode;
	className?: string;
	selectOptions?: { value: string; label: string }[];
}

export default function CustomFormField({
	form,
	name,
	label,
	placeholder,
	fieldType,
	type,
	disabled,
	children,
	className,
	selectOptions,
}: CustomFormFieldProps) {
	const [showPassword, setShowPassword] = useState(false);

	const getInputType = (): string => {
		if (fieldType === FormFieldType.PASSWORD) {
			return showPassword ? "text" : "password";
		}
		if (fieldType === FormFieldType.EMAIL) return "email";
		return type ?? "text";
	};

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
								type={getInputType()}
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
									type={getInputType()}
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
						<FormControl>
							<div
								className={cn(
									"group relative flex min-h-[140px] w-full overflow-hidden rounded-2xl border transition-all duration-200",
									"border-border bg-bg-input",
									"focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20",
								)}
							>
								<Textarea
									placeholder={finalPlaceholder}
									disabled={disabled}
									{...field}
									className={cn(
										"min-h-[140px] w-full resize-none border-0 bg-transparent px-4 py-4 text-sm shadow-none outline-none ring-0",
										"text-foreground placeholder:text-muted-foreground",
										"focus-visible:ring-0 focus-visible:ring-offset-0",
										className,
									)}
								/>
							</div>
						</FormControl>
					)}

				{fieldType === FormFieldType.SELECT && (
	<Select
		disabled={disabled}
		onValueChange={field.onChange}
		defaultValue={field.value || selectOptions?.[0]?.value}
		

	>
		<FormControl>
			<SelectTrigger className="h-12 w-full rounded-xl border-border bg-bg-input">
				<SelectValue placeholder={finalPlaceholder} />
			</SelectTrigger>
		</FormControl>

		<SelectContent className="rounded-xl border-border " >
			<SelectGroup >
				{selectOptions?.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectGroup>
		</SelectContent>
	</Select>
)}

					{fieldType === FormFieldType.DATE_PICKER && (
						<FormControl>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										disabled={disabled}
										className={cn(
											"h-12 w-full justify-start rounded-xl border border-border bg-bg-input px-4 text-left font-normal",
											"hover:bg-bg-input",
											"focus:border-primary/60 focus:ring-2 focus:ring-primary/20",
											!field.value && "text-muted-foreground",
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />

										{field.value ? (
											format(new Date(field.value), "dd/MM/yyyy")
										) : (
											<span>{finalPlaceholder}</span>
										)}
									</Button>
								</PopoverTrigger>

								<PopoverContent
									className="w-auto rounded-2xl border-border bg-card p-0"
									align="start"
								>
									<Calendar
										mode="single"
										selected={field.value ? new Date(field.value) : undefined}
										onSelect={field.onChange}
									/>
								</PopoverContent>
							</Popover>
						</FormControl>
					)}
					<FormMessage className="text-xs text-destructive" />
				</FormItem>
			)}
		/>
	);
}
