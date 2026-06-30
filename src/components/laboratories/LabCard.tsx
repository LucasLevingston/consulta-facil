"use client";

import {
	Calendar,
	ChevronDown,
	ChevronUp,
	Clock,
	MapPin,
	Phone,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { LabCardProps } from "./LabCard.types";
import { SlotPickerDialog } from "./SlotPickerDialog";

const DAY_LABELS: Record<string, string> = {
	MONDAY: "Seg",
	TUESDAY: "Ter",
	WEDNESDAY: "Qua",
	THURSDAY: "Qui",
	FRIDAY: "Sex",
	SATURDAY: "Sáb",
	SUNDAY: "Dom",
};

const DAY_ORDER = [
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
];

function formatTime(time: string) {
	return time.slice(0, 5);
}

export function LabCard({ lab, examRequestId }: LabCardProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [showHours, setShowHours] = useState(false);

	const sortedHours = useMemo(
		() =>
			[...(lab.hours ?? [])].sort(
				(a, b) =>
					DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek),
			),
		[lab.hours],
	);

	const openDays = sortedHours.filter((h) => h.isOpen);
	const hasHours = sortedHours.length > 0;

	return (
		<>
			<Card className="flex flex-col h-full transition-shadow duration-200 hover:shadow-md">
				{lab.imageUrl && (
					<div className="relative h-44 overflow-hidden rounded-t-xl bg-muted">
						<Image
							src={lab.imageUrl}
							alt={lab.name}
							fill
							unoptimized
							className="object-cover"
						/>
					</div>
				)}

				<CardContent className="flex flex-col flex-1 p-5 gap-3">
					{/* Name + description */}
					<div>
						<h3 className="font-semibold text-base leading-tight">
							{lab.name}
						</h3>
						{lab.description && (
							<p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
								{lab.description}
							</p>
						)}
					</div>

					{/* Location + phone */}
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

					{/* Accepted exams */}
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

					{/* Hours toggle */}
					{hasHours && (
						<div>
							<button
								type="button"
								onClick={() => setShowHours((v) => !v)}
								aria-expanded={showHours}
								className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer min-h-[36px]"
							>
								<Clock className="h-3.5 w-3.5 shrink-0" />
								{openDays.length > 0
									? `Aberto ${openDays.length}x por semana`
									: "Ver horários"}
								{showHours ? (
									<ChevronUp className="h-3 w-3" />
								) : (
									<ChevronDown className="h-3 w-3" />
								)}
							</button>

							{showHours && (
								<div className="mt-2 rounded-xl border bg-muted/40 p-3 space-y-1.5">
									{sortedHours.map((h) => (
										<div
											key={h.dayOfWeek}
											className={cn(
												"flex justify-between text-xs",
												h.isOpen
													? "text-foreground"
													: "text-muted-foreground opacity-50",
											)}
										>
											<span className="font-medium w-8 shrink-0">
												{DAY_LABELS[h.dayOfWeek] ?? h.dayOfWeek}
											</span>
											<span>
												{h.isOpen
													? `${formatTime(h.openTime)} – ${formatTime(h.closeTime)}`
													: "Fechado"}
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* CTA */}
					<div className="mt-auto pt-1">
						{examRequestId ? (
							<Button
								className="w-full gap-2 min-h-[44px]"
								size="sm"
								onClick={() => setDialogOpen(true)}
							>
								<Calendar className="h-4 w-4" />
								Agendar aqui
							</Button>
						) : (
							<Button
								variant="outline"
								className="w-full gap-2 min-h-[44px]"
								size="sm"
								onClick={() => setShowHours((v) => !v)}
							>
								<Clock className="h-4 w-4" />
								{showHours ? "Ocultar horários" : "Ver horários"}
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{examRequestId && (
				<SlotPickerDialog
					lab={lab}
					examRequestId={examRequestId}
					open={dialogOpen}
					onClose={() => setDialogOpen(false)}
				/>
			)}
		</>
	);
}
