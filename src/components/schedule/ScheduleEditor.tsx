"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DAYS_OF_WEEK,
	type DayOfWeek,
	type ProfessionalScheduleItem,
	useSaveMySchedule,
} from "@/features/schedule";
import { DEFAULT_BREAK } from "@/utils/constants/default-break";
import { DEFAULT_DURATION } from "@/utils/constants/default-duration";
import { ScheduleDaysList } from "./ScheduleDaysList";
import type { ScheduleEditorProps } from "./ScheduleEditor.types";
import { buildDefaultRow } from "./ScheduleEditor.utils";
import { ScheduleGlobalSettings } from "./ScheduleGlobalSettings";

export function ScheduleEditor({ savedSchedule }: ScheduleEditorProps) {
	const [rows, setRows] = useState<ProfessionalScheduleItem[]>(() =>
		DAYS_OF_WEEK.map((day) =>
			buildDefaultRow(
				day,
				savedSchedule.find((s) => s.dayOfWeek === day),
			),
		),
	);

	useEffect(() => {
		if (savedSchedule.length > 0) {
			setRows(
				DAYS_OF_WEEK.map((day) =>
					buildDefaultRow(
						day,
						savedSchedule.find((s) => s.dayOfWeek === day),
					),
				),
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

	function applyGlobalSettings(duration: number, breakTime: number) {
		setRows((prev) =>
			prev.map((r) => ({
				...r,
				consultationDurationMinutes: duration,
				breakBetweenConsultationsMinutes: breakTime,
			})),
		);
	}

	const firstActive = rows.find((r) => r.isActive);

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
			<ScheduleDaysList rows={rows} onUpdate={updateRow} />
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
