"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type {
	ClinicWorkingHoursItem,
	ClinicWorkingHoursResponse,
} from "@/features/schedule";
import {
	DAYS_OF_WEEK,
	type DayOfWeek,
	useSaveClinicWorkingHours,
} from "@/features/schedule";
import type { ClinicHoursEditorProps } from "./ClinicHoursEditor.types";
import { ClinicHoursRow } from "./ClinicHoursRow";

function buildDefaultHoursRow(
	day: DayOfWeek,
	saved?: ClinicWorkingHoursResponse,
): ClinicWorkingHoursItem {
	if (saved)
		return {
			dayOfWeek: day,
			openTime: saved.openTime,
			closeTime: saved.closeTime,
			isOpen: saved.isOpen,
		};
	const isWeekend = day === "SATURDAY" || day === "SUNDAY";
	return {
		dayOfWeek: day,
		openTime: "08:00",
		closeTime: "18:00",
		isOpen: !isWeekend,
	};
}

export function ClinicHoursEditor({
	clinicId,
	savedHours,
}: ClinicHoursEditorProps) {
	const [rows, setRows] = useState<ClinicWorkingHoursItem[]>(() =>
		DAYS_OF_WEEK.map((day) =>
			buildDefaultHoursRow(
				day,
				savedHours.find((h) => h.dayOfWeek === day),
			),
		),
	);

	useEffect(() => {
		if (savedHours.length > 0) {
			setRows(
				DAYS_OF_WEEK.map((day) =>
					buildDefaultHoursRow(
						day,
						savedHours.find((h) => h.dayOfWeek === day),
					),
				),
			);
		}
	}, [savedHours]);

	const { mutateAsync: saveHours, isPending } =
		useSaveClinicWorkingHours(clinicId);

	function updateRow(day: DayOfWeek, patch: Partial<ClinicWorkingHoursItem>) {
		setRows((prev) =>
			prev.map((r) => (r.dayOfWeek === day ? { ...r, ...patch } : r)),
		);
	}

	async function handleSave() {
		try {
			await saveHours(rows);
			toast.success("Horários salvos com sucesso!");
		} catch {
			toast.error("Erro ao salvar horários.");
		}
	}

	return (
		<div className="space-y-3">
			{rows.map((row) => (
				<ClinicHoursRow key={row.dayOfWeek} row={row} onUpdate={updateRow} />
			))}
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
