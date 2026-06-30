"use client";

import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils/cn";
import type { ThemeOptionProps } from "./ThemeOption.types";

export function ThemeOption({
	value,
	label,
	currentValue,
	children,
}: ThemeOptionProps) {
	return (
		<FormItem>
			<FormLabel className="cursor-pointer">
				<FormControl>
					<RadioGroupItem value={value} className="hidden" />
				</FormControl>
				<div
					className={cn(
						"rounded-md border-[3px] p-1 transition-colors",
						currentValue === value ? "border-primary" : "border-muted",
					)}
				>
					{children}
				</div>
				<span className="block w-full p-2 text-center font-normal">
					{label}
				</span>
			</FormLabel>
		</FormItem>
	);
}
