"use client";

import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarCheck, Clock, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

import { AppointmentCheckInCard } from "@/components/clinics/checkin/AppointmentCheckInCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePatientAppointments } from "@/features/appointments";
import { useUserStore } from "@/store/useUserStore";

export default function ClinicCheckInPage() {
	const { id } = useParams<{ id: string }>();
	const { user } = useUserStore();

	const { data, isLoading } = usePatientAppointments(user?.id ?? "", 0, 50);

	const todayAppointments = (data?.content ?? []).filter(
		(a) =>
			(a.status === "CONFIRMED" || a.status === "PENDING") &&
			isToday(new Date(a.scheduledAt)),
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
			<div className="mx-auto max-w-lg px-4 py-12 space-y-8">
				<div className="text-center space-y-2">
					<div className="flex justify-center mb-4">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
							<CalendarCheck className="h-8 w-8" />
						</div>
					</div>
					<h1 className="text-2xl font-bold text-foreground">
						Check-in na fila
					</h1>
					<p className="text-sm text-muted-foreground">
						{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
					</p>
				</div>

				{!user ? (
					<Card>
						<CardContent className="flex flex-col items-center gap-3 py-10 text-center">
							<Clock className="h-10 w-10 text-muted-foreground/40" />
							<p className="text-muted-foreground">
								Faça login para acessar suas consultas de hoje.
							</p>
							<Button asChild>
								<a href={`/auth/login?redirect=/clinics/${id}/checkin`}>
									Entrar
								</a>
							</Button>
						</CardContent>
					</Card>
				) : isLoading ? (
					<div className="flex h-32 items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : todayAppointments.length === 0 ? (
					<Card>
						<CardHeader>
							<CardTitle className="text-base text-center text-muted-foreground">
								Nenhuma consulta encontrada
							</CardTitle>
						</CardHeader>
						<CardContent className="text-center text-sm text-muted-foreground pb-6">
							Você não tem consultas confirmadas ou pendentes para hoje.
						</CardContent>
					</Card>
				) : (
					<div className="space-y-3">
						<p className="text-sm font-medium text-muted-foreground px-1">
							Selecione sua consulta para fazer check-in:
						</p>
						{todayAppointments.map((appt) => (
							<AppointmentCheckInCard key={appt.id} appointment={appt} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
