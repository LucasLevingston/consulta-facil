"use client";

import { cn } from "@/lib/utils/cn";
import { DAYS, type DayKey } from "@/utils/constants/days-of-week";

interface Props {
	selectedDays: DayKey[];
	onToggle: (day: DayKey) => void;
}

export function ClinicsFiltersDayPicker({ selectedDays, onToggle }: Props) {
	return (
		<div className="space-y-1.5">
			<span className="text-xs font-medium text-muted-foreground">
				Horário de funcionamento
			</span>
			<div className="flex flex-wrap gap-1.5">
				{DAYS.map(({ key, label }) => (
					<button
						key={key}
						type="button"
						onClick={() => onToggle(key)}
						className={cn(
							"px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer",
							selectedDays.includes(key)
								? "bg-primary text-primary-foreground border-primary"
								: "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
						)}
					>
						{label}
					</button>
				))}
			</div>
		</div>
	);
}
