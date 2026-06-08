import { BadgeCheck, CalendarDays, FileText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

export function ProfileAppointmentStats({
	appointments,
}: {
	appointments: AppointmentResponse[];
}) {
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
