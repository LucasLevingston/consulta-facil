"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type {
	ClinicWorkingHoursItem,
	ClinicWorkingHoursResponse,
} from "@/features/schedule";
import {
	DAY_LABELS,
	DAYS_OF_WEEK,
	type DayOfWeek,
	useSaveClinicWorkingHours,
} from "@/features/schedule";

function buildDefaultHoursRow(
	day: DayOfWeek,
	saved?: ClinicWorkingHoursResponse,
): ClinicWorkingHoursItem {
	if (saved) {
		return {
			dayOfWeek: day,
			openTime: saved.openTime,
			closeTime: saved.closeTime,
			isOpen: saved.isOpen,
		};
	}
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
}: {
	clinicId: string;
	savedHours: ClinicWorkingHoursResponse[];
}) {
	const [rows, setRows] = useState<ClinicWorkingHoursItem[]>(() =>
		DAYS_OF_WEEK.map((day) => {
			const saved = savedHours.find((h) => h.dayOfWeek === day);
			return buildDefaultHoursRow(day, saved);
		}),
	);

	useEffect(() => {
		if (savedHours.length > 0) {
			setRows(
				DAYS_OF_WEEK.map((day) => {
					const saved = savedHours.find((h) => h.dayOfWeek === day);
					return buildDefaultHoursRow(day, saved);
				}),
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
				<Card key={row.dayOfWeek} className={row.isOpen ? "" : "opacity-60"}>
					<CardContent className="pt-4 pb-4">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
							<div className="flex items-center gap-3 sm:w-36">
								<Switch
									checked={row.isOpen}
									onCheckedChange={(checked) =>
										updateRow(row.dayOfWeek, { isOpen: checked })
									}
								/>
								<span className="text-sm font-medium w-16">
									{DAY_LABELS[row.dayOfWeek]}
								</span>
								{row.isOpen ? (
									<Badge
										variant="default"
										className="text-xs hidden sm:inline-flex"
									>
										Aberto
									</Badge>
								) : (
									<Badge
										variant="secondary"
										className="text-xs hidden sm:inline-flex"
									>
										Fechado
									</Badge>
								)}
							</div>

							<div className="flex items-center gap-3 flex-1">
								<div className="flex items-center gap-2">
									<Label className="text-xs text-muted-foreground shrink-0">
										Abre
									</Label>
									<Input
										type="time"
										value={row.openTime}
										disabled={!row.isOpen}
										onChange={(e) =>
											updateRow(row.dayOfWeek, { openTime: e.target.value })
										}
										className="h-9 w-28 rounded-lg border-border bg-bg-input text-sm"
									/>
								</div>
								<div className="flex items-center gap-2">
									<Label className="text-xs text-muted-foreground shrink-0">
										Fecha
									</Label>
									<Input
										type="time"
										value={row.closeTime}
										disabled={!row.isOpen}
										onChange={(e) =>
											updateRow(row.dayOfWeek, { closeTime: e.target.value })
										}
										className="h-9 w-28 rounded-lg border-border bg-bg-input text-sm"
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
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
