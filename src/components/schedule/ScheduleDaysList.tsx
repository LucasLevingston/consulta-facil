import type { DayOfWeek, ProfessionalScheduleItem } from "@/features/schedule";
import { ScheduleDayRow } from "./ScheduleDayRow";

interface Props {
	rows: ProfessionalScheduleItem[];
	onUpdate: (day: DayOfWeek, patch: Partial<ProfessionalScheduleItem>) => void;
}

export function ScheduleDaysList({ rows, onUpdate }: Props) {
	return (
		<div className="space-y-3">
			<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
				Dias da semana
			</h3>
			{rows.map((row) => (
				<ScheduleDayRow
					key={row.dayOfWeek}
					row={row}
					onChange={(patch) => onUpdate(row.dayOfWeek, patch)}
				/>
			))}
		</div>
	);
}
