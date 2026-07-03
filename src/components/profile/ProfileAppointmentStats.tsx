import { CalendarDays } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProfileAppointmentStatsProps } from "./ProfileAppointmentStats.types";

export function ProfileAppointmentStats({
	appointments,
}: ProfileAppointmentStatsProps) {
	const stats = [
		{
			label: "Total",
			value: appointments.length,
			color: "text-foreground",
		},
		{
			label: "Pendentes",
			value: appointments.filter((a) => a.status === "PENDING").length,
			color: "text-yellow-500",
		},
		{
			label: "Confirmadas",
			value: appointments.filter((a) => a.status === "CONFIRMED").length,
			color: "text-green-500",
		},
		{
			label: "Concluídas",
			value: appointments.filter((a) => a.status === "COMPLETED").length,
			color: "text-blue-500",
		},
	];

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base flex items-center gap-2">
					<CalendarDays className="h-4 w-4 text-primary" />
					Resumo de consultas
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{stats.map(({ label, value, color }) => (
					<div key={label} className="flex items-center justify-between py-1">
						<span className="text-sm text-muted-foreground">{label}</span>
						<span className={`text-sm font-semibold ${color}`}>{value}</span>
					</div>
				))}
				<Separator />
				<Button
					variant="outline"
					size="sm"
					asChild
					className="w-full rounded-xl mt-2"
				>
					<Link href="/dashboard/appointments">Ver todas</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
