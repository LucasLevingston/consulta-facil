"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMySchedule, useSaveMySchedule } from "@/hooks/api/use-schedule";
import {
	DAY_LABELS,
	DAYS_OF_WEEK,
	type DayOfWeek,
	type ProfessionalScheduleItem,
	type ProfessionalScheduleResponse,
} from "@/lib/schemas/schedule.schema";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";

export default function SchedulePage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Horários de Atendimento"
				description="Configure seus dias e horários disponíveis para consultas."
				icon={<Clock className="h-6 w-6" />}
			/>
			<ScheduleContent />
		</div>
	);
}

function ScheduleContent() {
	const { user } = useUserStore();
	const isProfessional = user?.role === "PROFESSIONAL";
	const {
		data: schedule = [],
		isLoading,
		error,
	} = useMySchedule(isProfessional);

	if (!isProfessional) {
		return (
			<p className="text-sm text-muted-foreground">
				Apenas profissionais podem configurar horários de atendimento.
			</p>
		);
	}

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<ScheduleEditor savedSchedule={schedule} />
		</QueryBoundary>
	);
}

const DEFAULT_DURATION = 30;
const DEFAULT_BREAK = 10;

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

function ScheduleEditor({
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
			<GlobalSettings
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
					<DayRow
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

function GlobalSettings({
	defaultDuration,
	defaultBreak,
	onApply,
}: {
	defaultDuration: number;
	defaultBreak: number;
	onApply: (duration: number, breakTime: number) => void;
}) {
	const [duration, setDuration] = useState(defaultDuration);
	const [breakTime, setBreakTime] = useState(defaultBreak);

	useEffect(() => {
		setDuration(defaultDuration);
		setBreakTime(defaultBreak);
	}, [defaultDuration, defaultBreak]);

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Configurações de consulta
					</h3>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label
								htmlFor="duration"
								className="text-sm font-semibold text-primary"
							>
								Duração da consulta (min)
							</Label>
							<Input
								id="duration"
								type="number"
								min={5}
								max={480}
								value={duration}
								onChange={(e) => setDuration(Number(e.target.value))}
								className="h-12 rounded-xl border-border bg-bg-input"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="break"
								className="text-sm font-semibold text-primary"
							>
								Intervalo entre consultas (min)
							</Label>
							<Input
								id="break"
								type="number"
								min={0}
								max={120}
								value={breakTime}
								onChange={(e) => setBreakTime(Number(e.target.value))}
								className="h-12 rounded-xl border-border bg-bg-input"
							/>
						</div>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onApply(duration, breakTime)}
					>
						Aplicar a todos os dias
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

function DayRow({
	row,
	onChange,
}: {
	row: ProfessionalScheduleItem;
	onChange: (patch: Partial<ProfessionalScheduleItem>) => void;
}) {
	return (
		<Card className={row.isActive ? "" : "opacity-60"}>
			<CardContent className="pt-4 pb-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
					<div className="flex items-center gap-3 sm:w-32">
						<Switch
							checked={row.isActive}
							onCheckedChange={(checked) => onChange({ isActive: checked })}
						/>
						<span className="text-sm font-medium w-16">
							{DAY_LABELS[row.dayOfWeek]}
						</span>
						{row.isActive ? (
							<Badge
								variant="default"
								className="text-xs hidden sm:inline-flex"
							>
								Ativo
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
								De
							</Label>
							<Input
								type="time"
								value={row.startTime}
								disabled={!row.isActive}
								onChange={(e) => onChange({ startTime: e.target.value })}
								className="h-9 w-28 rounded-lg border-border bg-bg-input text-sm"
							/>
						</div>
						<div className="flex items-center gap-2">
							<Label className="text-xs text-muted-foreground shrink-0">
								Até
							</Label>
							<Input
								type="time"
								value={row.endTime}
								disabled={!row.isActive}
								onChange={(e) => onChange({ endTime: e.target.value })}
								className="h-9 w-28 rounded-lg border-border bg-bg-input text-sm"
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
