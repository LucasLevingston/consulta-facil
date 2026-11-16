"use client";

import { Button } from "@/components/ui/button";
import type { AnalyticsPeriodSelectProps } from "./AnalyticsPeriodSelect.types";
import { ANALYTICS_PERIOD_OPTIONS } from "./professional-analytics.constants";

export function AnalyticsPeriodSelect({
	value,
	onChange,
	disabled,
}: AnalyticsPeriodSelectProps) {
	return (
		<fieldset
			aria-label="Período"
			className="inline-flex gap-1 rounded-lg border p-1"
		>
			{ANALYTICS_PERIOD_OPTIONS.map((option) => (
				<Button
					key={option.value}
					type="button"
					size="sm"
					variant={option.value === value ? "default" : "ghost"}
					aria-pressed={option.value === value}
					disabled={disabled}
					onClick={() => onChange(option.value)}
				>
					{option.label}
				</Button>
			))}
		</fieldset>
	);
}
