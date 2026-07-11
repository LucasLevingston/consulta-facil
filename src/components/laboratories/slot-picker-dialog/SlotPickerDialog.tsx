"use client";

import { format } from "date-fns";
import { FlaskConical, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { SlotConfirmation } from "./SlotConfirmation";
import { SlotDatePicker } from "./SlotDatePicker";
import type { SlotPickerDialogProps } from "./SlotPickerDialog.types";
import { SlotTimePicker } from "./SlotTimePicker";
import { useAvailableSlots } from "./use-available-slots";
import { useScheduleExam } from "./use-schedule-exam";

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
				<SlotDatePicker
					selectedDate={selectedDate}
					onSelect={(d) => {
						setSelectedDate(d);
						setSelectedTime(null);
					}}
				/>
				{selectedDate && (
					<SlotTimePicker
						slots={slots}
						slotsLoading={slotsLoading}
						selectedTime={selectedTime}
						onSelect={setSelectedTime}
					/>
				)}
				{selectedDate && selectedTime && (
					<SlotConfirmation
						selectedDate={selectedDate}
						selectedTime={selectedTime}
						isPending={isPending}
						onConfirm={handleConfirm}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}
