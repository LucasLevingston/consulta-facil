"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	Calendar,
	CheckCircle2,
	Clock,
	FlaskConical,
	Loader2,
	MapPin,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAvailableSlots, useScheduleExam } from "@/features/exams";
import { cn } from "@/lib/utils/cn";
import type { SlotPickerDialogProps } from "./SlotPickerDialog.types";

function formatTime(time: string) {
	return time.slice(0, 5);
}

export function SlotPickerDialog({
	lab,
	examRequestId,
	open,
	onClose,
}: SlotPickerDialogProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const { mutateAsync: scheduleExam, isPending } = useScheduleExam();

	const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

	const { data: slots = [], isLoading: slotsLoading } = useAvailableSlots(
		open ? lab.id : null,
		open ? dateStr : null,
	);

	async function handleConfirm() {
		if (!selectedDate || !selectedTime || !examRequestId) return;
		try {
			await scheduleExam({
				examRequestId,
				examLabId: lab.id,
				scheduledDate: format(selectedDate, "yyyy-MM-dd"),
				scheduledTime: selectedTime,
			});
			toast.success("Exame agendado com sucesso!");
			onClose();
		} catch {
			toast.error("Erro ao agendar exame. Tente novamente.");
		}
	}

	function handleClose() {
		setSelectedDate(undefined);
		setSelectedTime(null);
		onClose();
	}

	const availableSlots = slots.filter((s) => s.available);

	return (
		<Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
			<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-base">
						<FlaskConical className="h-5 w-5 text-primary shrink-0" />
						{lab.name}
					</DialogTitle>
					{(lab.address || lab.city) && (
						<p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
							<MapPin className="h-3.5 w-3.5 shrink-0" />
							{[lab.address, lab.city].filter(Boolean).join(", ")}
						</p>
					)}
				</DialogHeader>

				<Separator />

				{/* Step 1 — choose date */}
				<div className="space-y-2">
					<p className="text-sm font-medium flex items-center gap-1.5">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						Escolha a data
					</p>
					<div className="flex justify-center">
						<CalendarPicker
							mode="single"
							selected={selectedDate}
							onSelect={(d) => {
								setSelectedDate(d);
								setSelectedTime(null);
							}}
							disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
							locale={ptBR}
							className="rounded-xl border"
						/>
					</div>
				</div>

				{/* Step 2 — choose time */}
				{selectedDate && (
					<div className="space-y-2">
						<p className="text-sm font-medium flex items-center gap-1.5">
							<Clock className="h-4 w-4 text-muted-foreground" />
							Horários disponíveis
							{slotsLoading && (
								<Loader2 className="h-3.5 w-3.5 animate-spin ml-1 text-muted-foreground" />
							)}
						</p>

						{!slotsLoading && slots.length === 0 && (
							<p className="text-sm text-muted-foreground text-center py-6 rounded-xl bg-muted/40">
								Laboratório fechado nesta data.
							</p>
						)}

						{!slotsLoading &&
							slots.length > 0 &&
							availableSlots.length === 0 && (
								<p className="text-sm text-muted-foreground text-center py-6 rounded-xl bg-muted/40">
									Todos os horários estão ocupados nesta data.
								</p>
							)}

						{!slotsLoading && slots.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{slots.map((slot) => (
									<button
										key={slot.time}
										type="button"
										aria-label={`Horário ${formatTime(slot.time)}${!slot.available ? ", indisponível" : ""}`}
										aria-pressed={selectedTime === slot.time}
										disabled={!slot.available}
										onClick={() => setSelectedTime(slot.time)}
										className={cn(
											"min-h-[44px] px-4 rounded-xl text-sm font-medium border transition-colors duration-150",
											!slot.available &&
												"opacity-40 cursor-not-allowed bg-muted text-muted-foreground border-border",
											slot.available &&
												selectedTime !== slot.time &&
												"bg-background hover:bg-muted border-border text-foreground cursor-pointer",
											selectedTime === slot.time &&
												"bg-primary text-primary-foreground border-primary cursor-pointer",
										)}
									>
										{formatTime(slot.time)}
									</button>
								))}
							</div>
						)}
					</div>
				)}

				{/* Step 3 — confirm */}
				{selectedDate && selectedTime && (
					<div className="space-y-3">
						<Separator />
						<div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-sm space-y-0.5">
							<p className="font-semibold text-primary">
								Resumo do agendamento
							</p>
							<p className="text-muted-foreground">
								{format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
									locale: ptBR,
								})}{" "}
								às {formatTime(selectedTime)}
							</p>
						</div>

						<Button
							className="w-full gap-2 min-h-[44px]"
							onClick={handleConfirm}
							disabled={isPending}
						>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<CheckCircle2 className="h-4 w-4" />
							)}
							{isPending ? "Agendando..." : "Confirmar agendamento"}
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
