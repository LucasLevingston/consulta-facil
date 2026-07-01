"use client";

import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LabCardProps } from "./LabCard.types";
import { LabCardHours } from "./LabCardHours";
import { LabCardInfo } from "./LabCardInfo";
import { SlotPickerDialog } from "./SlotPickerDialog";

const DAY_ORDER = [
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
];

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
					<LabCardInfo lab={lab} />
					{sortedHours.length > 0 && (
						<LabCardHours
							sortedHours={sortedHours}
							openDays={openDays.length}
							showHours={showHours}
							onToggle={() => setShowHours((v) => !v)}
						/>
					)}
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
