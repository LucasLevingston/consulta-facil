"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { ControllerRenderProps } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl } from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/cn";

// biome-ignore lint/suspicious/noExplicitAny: shared field component works with any form schema
type AnyField = ControllerRenderProps<any, string>;

interface Props {
	field: AnyField;
	placeholder: string | undefined;
	disabled?: boolean;
}

export function FormFieldDatePicker({ field, placeholder, disabled }: Props) {
	return (
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
							<span>{placeholder}</span>
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
	);
}
