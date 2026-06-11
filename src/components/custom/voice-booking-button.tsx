"use client";

import { Loader2, Mic, MicOff, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVoiceBooking } from "@/hooks/use-voice-booking";
import type { VoiceBookingResult } from "@/lib/types/ai";
import { cn } from "@/lib/utils/cn";

interface VoiceBookingButtonProps {
	onResult: (result: VoiceBookingResult) => void;
	className?: string;
}

export function VoiceBookingButton({
	onResult,
	className,
}: VoiceBookingButtonProps) {
	const { status, transcript, result, error, isSupported, start, stop, reset } =
		useVoiceBooking();

	if (!isSupported) return null;

	if (result && status === "done") {
		return (
			<div className="flex flex-col gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
				<div className="flex items-center justify-between gap-2">
					<p className="text-xs font-medium text-primary">{result.summary}</p>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-6 w-6 shrink-0"
						onClick={reset}
					>
						<X className="h-3 w-3" />
					</Button>
				</div>
				<div className="flex flex-wrap gap-1.5">
					{result.specialty && (
						<Badge variant="secondary" className="text-xs">
							{result.specialty}
						</Badge>
					)}
					{result.date && (
						<Badge variant="secondary" className="text-xs">
							{new Date(result.date + "T12:00:00").toLocaleDateString("pt-BR")}
						</Badge>
					)}
					{result.timePreference && result.timePreference !== "any" && (
						<Badge variant="secondary" className="text-xs">
							{result.timePreference === "morning"
								? "Manhã"
								: result.timePreference === "afternoon"
									? "Tarde"
									: "Noite"}
						</Badge>
					)}
				</div>
				<Button
					type="button"
					size="sm"
					className="w-full"
					onClick={() => {
						onResult(result);
						reset();
					}}
				>
					Usar esses dados
				</Button>
			</div>
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
