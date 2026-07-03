"use client";

import { Stethoscope, X } from "lucide-react";

import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import type { SelectedProfessionalCardProps } from "./SelectedProfessionalCard.types";

export function SelectedProfessionalCard({
	professional,
	showClear,
	onClear,
}: SelectedProfessionalCardProps) {
	return (
		<div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
			<Stethoscope className="h-4 w-4 text-primary shrink-0" />
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium">{professional.name}</p>
				<p className="text-xs text-muted-foreground">
					{SPECIALTY_LABELS[professional.specialty] ?? professional.specialty}
				</p>
			</div>
			{showClear && (
				<button
					type="button"
					onClick={onClear}
					className="text-muted-foreground hover:text-foreground transition-colors"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
