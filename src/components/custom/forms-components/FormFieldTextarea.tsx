"use client";

import type { ControllerRenderProps } from "react-hook-form";
import { FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";

// biome-ignore lint/suspicious/noExplicitAny: shared field component works with any form schema
type AnyField = ControllerRenderProps<any, string>;

interface Props {
	field: AnyField;
	placeholder: string | undefined;
	disabled?: boolean;
	className?: string;
}

export function FormFieldTextarea({
	field,
	placeholder,
	disabled,
	className,
}: Props) {
	return (
		<FormControl>
			<div
				className={cn(
					"group relative flex min-h-[140px] w-full overflow-hidden rounded-2xl border transition-all duration-200",
					"border-border bg-bg-input",
					"focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20",
				)}
			>
				<Textarea
					placeholder={placeholder}
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
	);
}
