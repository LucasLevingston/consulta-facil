"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useSaveMySchedule } from "@/hooks/api/schedule/use-save-my-schedule";
import {
	DAYS_OF_WEEK,
	type DayOfWeek,
} from "@/lib/schemas/schedule/days-of-week.schema";
import type { ProfessionalScheduleItem } from "@/lib/schemas/schedule/professional-schedule-item.schema";
import type { ProfessionalScheduleResponse } from "@/lib/schemas/schedule/professional-schedule-response.schema";
import { DEFAULT_BREAK } from "@/utils/constants/default-break";
import { DEFAULT_DURATION } from "@/utils/constants/default-duration";

import { ScheduleDayRow } from "./ScheduleDayRow";
import { ScheduleGlobalSettings } from "./ScheduleGlobalSettings";

function buildDefaultRow(
	day: DayOfWeek,
	saved?: ProfessionalScheduleResponse,
): ProfessionalScheduleItem {
	if (saved) {
		return {
			dayOfWeek: day,
			startTime: saved.startTime,
			endTime: saved.endTime,
			consultationDurationMinutes: saved.consultationDurationMinutes,
			breakBetweenConsultationsMinutes: saved.breakBetweenConsultationsMinutes,
			isActive: saved.isActive,
		};
	}
	const isWeekend = day === "SATURDAY" || day === "SUNDAY";
	return {
		dayOfWeek: day,
		startTime: "08:00",
		endTime: "18:00",
		consultationDurationMinutes: DEFAULT_DURATION,
		breakBetweenConsultationsMinutes: DEFAULT_BREAK,
		isActive: !isWeekend,
	};
}

export function ScheduleEditor({
	savedSchedule,
}: {
	savedSchedule: ProfessionalScheduleResponse[];
}) {
	const [rows, setRows] = useState<ProfessionalScheduleItem[]>(() =>
		DAYS_OF_WEEK.map((day) => {
			const saved = savedSchedule.find((s) => s.dayOfWeek === day);
			return buildDefaultRow(day, saved);
		}),
	);

	useEffect(() => {
		if (savedSchedule.length > 0) {
			setRows(
				DAYS_OF_WEEK.map((day) => {
					const saved = savedSchedule.find((s) => s.dayOfWeek === day);
					return buildDefaultRow(day, saved);
				}),
			);
		}
	}, [savedSchedule]);

	const { mutateAsync: saveSchedule, isPending } = useSaveMySchedule();

	function updateRow(day: DayOfWeek, patch: Partial<ProfessionalScheduleItem>) {
		setRows((prev) =>
			prev.map((r) => (r.dayOfWeek === day ? { ...r, ...patch } : r)),
		);
	}

	async function handleSave() {
		try {
			await saveSchedule(rows);
			toast.success("Horários salvos com sucesso!");
		} catch {
			toast.error("Erro ao salvar horários.");
		}
	}

	const activeRows = rows.filter((r) => r.isActive);
	const firstActive = activeRows[0];

	function applyGlobalSettings(duration: number, breakTime: number) {
		setRows((prev) =>
			prev.map((r) => ({
				...r,
				consultationDurationMinutes: duration,
				breakBetweenConsultationsMinutes: breakTime,
			})),
		);
	}

	return (
		<div className="max-w-3xl space-y-6">
			<ScheduleGlobalSettings
				defaultDuration={
					firstActive?.consultationDurationMinutes ?? DEFAULT_DURATION
				}
				defaultBreak={
					firstActive?.breakBetweenConsultationsMinutes ?? DEFAULT_BREAK
				}
				onApply={applyGlobalSettings}
			/>

			<div className="space-y-3">
				<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					Dias da semana
				</h3>
				{rows.map((row) => (
					<ScheduleDayRow
						key={row.dayOfWeek}
						row={row}
						onChange={(patch) => updateRow(row.dayOfWeek, patch)}
					/>
				))}
			</div>

			<Button
				onClick={handleSave}
				disabled={isPending}
				className="w-full sm:w-auto"
			>
				{isPending ? "Salvando..." : "Salvar horários"}
			</Button>
		</div>
	);
}
