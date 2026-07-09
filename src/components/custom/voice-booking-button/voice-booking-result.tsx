import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VoiceBookingResult } from "@/features/appointments";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

interface Props {
	result: VoiceBookingResult;
	onReset: () => void;
	onUse: () => void;
}

export function VoiceBookingResultCard({ result, onReset, onUse }: Props) {
	return (
		<div className="flex flex-col gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
			<div className="flex items-center justify-between gap-2">
				<p className="text-xs font-medium text-primary">{result.summary}</p>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="h-6 w-6 shrink-0"
					onClick={onReset}
				>
					<X className="h-3 w-3" />
				</Button>
			</div>
			<div className="flex flex-wrap gap-1.5">
				{result.specialty && (
					<Badge variant="secondary" className="text-xs">
						{SPECIALTY_LABELS[result.specialty] ?? result.specialty}
					</Badge>
				)}
				{result.date && (
					<Badge variant="secondary" className="text-xs">
						{new Date(`${result.date}T12:00:00`).toLocaleDateString("pt-BR")}
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
			<Button type="button" size="sm" className="w-full" onClick={onUse}>
				Usar esses dados
			</Button>
		</div>
	);
}
