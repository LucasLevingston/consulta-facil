"use client";

import type { ControllerRenderProps } from "react-hook-form";
import { FormControl } from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// biome-ignore lint/suspicious/noExplicitAny: shared field component works with any form schema
type AnyField = ControllerRenderProps<any, string>;

interface Props {
	field: AnyField;
	placeholder: string | undefined;
	disabled?: boolean;
	selectOptions?: { value: string; label: string }[];
}

export function FormFieldSelect({
	field,
	placeholder,
	disabled,
	selectOptions,
}: Props) {
	return (
		<Select
			disabled={disabled}
			value={field.value ?? ""}
			onValueChange={field.onChange}
		>
			<FormControl>
				<SelectTrigger className="h-12 w-full rounded-xl border-border bg-bg-input">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
			</FormControl>
			<SelectContent className="rounded-xl border-border">
				<SelectGroup>
					{selectOptions?.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
