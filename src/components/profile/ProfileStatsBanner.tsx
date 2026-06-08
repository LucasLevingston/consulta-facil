import { BadgeCheck, CalendarDays, FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

export function ProfileStatsBanner({
	appointments,
}: {
	appointments: AppointmentResponse[];
}) {
	const items = [
		{
			label: "Consultas",
			value: appointments.length,
			icon: CalendarDays,
			color: "text-primary",
			bg: "bg-primary/10",
		},
		{
			label: "Confirmadas",
			value: appointments.filter((a) => a.status === "CONFIRMED").length,
			icon: BadgeCheck,
			color: "text-green-500",
			bg: "bg-green-500/10",
		},
		{
			label: "Concluídas",
			value: appointments.filter((a) => a.status === "COMPLETED").length,
			icon: FileText,
			color: "text-blue-500",
			bg: "bg-blue-500/10",
		},
	];

	return (
		<div className="grid grid-cols-3 gap-4">
			{items.map(({ label, value, icon: Icon, color, bg }) => (
				<Card key={label} className="text-center">
					<CardContent className="pt-5 pb-4 space-y-2">
						<div
							className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}
						>
							<Icon className={`h-5 w-5 ${color}`} />
						</div>
						<p className={`text-2xl font-bold ${color}`}>{value}</p>
						<p className="text-xs text-muted-foreground">{label}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
