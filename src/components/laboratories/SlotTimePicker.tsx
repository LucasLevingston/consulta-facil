"use client";

import { Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Slot = { time: string; available: boolean };

interface Props {
	slots: Slot[];
	slotsLoading: boolean;
	selectedTime: string | null;
	onSelect: (time: string) => void;
}

export function SlotTimePicker({
	slots,
	slotsLoading,
	selectedTime,
	onSelect,
}: Props) {
	function formatTime(time: string) {
		return time.slice(0, 5);
	}

	const availableSlots = slots.filter((s) => s.available);
	return (
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
			{!slotsLoading && slots.length > 0 && availableSlots.length === 0 && (
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
							onClick={() => onSelect(slot.time)}
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
	);
}
