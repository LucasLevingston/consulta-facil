"use client";

import { MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ExamLabResponse } from "@/features/exams";

interface Props {
	lab: ExamLabResponse;
}

export function LabCardInfo({ lab }: Props) {
	return (
		<>
			<div>
				<h3 className="font-semibold text-base leading-tight">{lab.name}</h3>
				{lab.description && (
					<p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
						{lab.description}
					</p>
				)}
			</div>
			<div className="space-y-1">
				{(lab.address || lab.city) && (
					<p className="text-xs text-muted-foreground flex items-start gap-1.5">
						<MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
						{[lab.address, lab.city, lab.state].filter(Boolean).join(", ")}
					</p>
				)}
				{lab.phone && (
					<p className="text-xs text-muted-foreground flex items-center gap-1.5">
						<Phone className="h-3.5 w-3.5 shrink-0" />
						{lab.phone}
					</p>
				)}
			</div>
			{lab.acceptedExams && lab.acceptedExams.length > 0 && (
				<div className="flex flex-wrap gap-1.5">
					{lab.acceptedExams.slice(0, 4).map((e) => (
						<Badge key={e} variant="secondary" className="text-xs">
							{e}
						</Badge>
					))}
					{lab.acceptedExams.length > 4 && (
						<Badge variant="outline" className="text-xs">
							+{lab.acceptedExams.length - 4} mais
						</Badge>
					)}
				</div>
			)}
		</>
	);
}
