"use client";

import { Loader2, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceBooking } from "@/features/appointments";
import { cn } from "@/lib/utils/cn";
import type { VoiceBookingButtonProps } from "./voice-booking-button.types";
import { VoiceBookingResultCard } from "./voice-booking-result";

export function VoiceBookingButton({
	onResult,
	className,
}: VoiceBookingButtonProps) {
	const { status, transcript, result, error, isSupported, start, stop, reset } =
		useVoiceBooking();

	if (!isSupported) return null;

	if (result && status === "done") {
		return (
			<VoiceBookingResultCard
				result={result}
				onReset={reset}
				onUse={() => {
					onResult(result);
					reset();
				}}
			/>
		);
	}

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			{transcript && (
				<p className="text-xs text-muted-foreground italic">"{transcript}"</p>
			)}
			{error && <p className="text-xs text-destructive">{error}</p>}
			<Button
				type="button"
				variant={status === "listening" ? "destructive" : "outline"}
				size="sm"
				className={cn(
					"gap-2 transition-all",
					status === "listening" && "animate-pulse",
				)}
				onClick={status === "listening" ? stop : start}
				disabled={status === "processing"}
			>
				{status === "processing" ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : status === "listening" ? (
					<MicOff className="h-4 w-4" />
				) : (
					<Mic className="h-4 w-4" />
				)}
				{status === "processing"
					? "Processando..."
					: status === "listening"
						? "Parar gravação"
						: "Agendar por voz"}
			</Button>
		</div>
	);
}
