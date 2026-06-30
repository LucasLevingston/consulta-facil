"use client";

import {
	ArrowRight,
	BadgeCheck,
	CalendarDays,
	CheckCircle2,
	Clock,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
	useCompleteAppointment,
	useConfirmAppointment,
	usePatientAppointments,
	useProfessionalAppointments,
} from "@/features/appointments";
import { useUserStore } from "@/features/auth";
import { useMyProfessionalProfile } from "@/features/professionals";
import { adminCards } from "./admin-cards";
import { AppointmentsList } from "./appointments-list";
import type { DashboardProps } from "./Dashboard.types";
import { ProfessionalHeroSubtitle } from "./ProfessionalHeroSubtitle";
import { patientCards } from "./patient-cards";
import { professionalCards } from "./professional-cards";
import { QuickAccessCard } from "./QuickAccessCard";
import { StatCard } from "./stat-card";

export function Dashboard({ firstName, userRole }: DashboardProps) {
	const { user } = useUserStore();
	const isProfessional = userRole === "PROFESSIONAL";
	const isAdmin = userRole === "ADMIN";
	const isPatient = userRole === "PATIENT";

	const { data: professionalProfile } =
		useMyProfessionalProfile(isProfessional);
	const professionalId = professionalProfile?.id ?? "";

	const patientQuery = usePatientAppointments(
		isPatient ? (user?.id ?? "") : "",
	);
	const professionalQuery = useProfessionalAppointments(
		isProfessional ? professionalId : "",
	);

	const { mutateAsync: confirm } = useConfirmAppointment();
	const { mutateAsync: complete } = useCompleteAppointment();

	const appointments = isProfessional
		? (professionalQuery.data?.content ?? [])
		: (patientQuery.data?.content ?? []);

	const stats = useMemo(
		() => ({
			total: appointments.length,
			confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
			pending: appointments.filter((a) => a.status === "PENDING").length,
			completed: appointments.filter((a) => a.status === "COMPLETED").length,
			canceled: appointments.filter((a) => a.status === "CANCELED").length,
		}),
		[appointments],
	);

	const upcoming = useMemo(() => {
		const now = new Date();
		return appointments
			.filter(
				(a) =>
					(a.status === "CONFIRMED" || a.status === "PENDING") &&
					new Date(a.scheduledAt) >= now,
			)
			.sort(
				(a, b) =>
					new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
			)
			.slice(0, isProfessional ? 5 : 3);
	}, [appointments, isProfessional]);

	const cards = isAdmin
		? adminCards
		: isProfessional
			? professionalCards
			: patientCards;

	const heroLabel = isAdmin
		? "Painel administrativo"
		: isProfessional
			? "Painel do profissional"
			: "Bem-vindo de volta";

	return (
		<div className="space-y-6">
			{/* Hero */}
			<div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 sm:p-8">
				<div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
				<div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />
				<div className="relative z-10">
					<p className="text-sm font-medium text-primary">{heroLabel}</p>
					<h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
						Olá, {firstName}!
					</h1>
					{isProfessional && <ProfessionalHeroSubtitle />}
					{isPatient && (
						<p className="mt-1 text-sm text-muted-foreground">
							O que você quer fazer hoje?
						</p>
					)}
					{isAdmin && (
						<p className="mt-1 text-sm text-muted-foreground">
							Acesso completo à plataforma.
						</p>
					)}
				</div>
			</div>

			{/* Stats */}
			{(isProfessional || isPatient) && (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
					<StatCard
						icon={<CalendarDays className="h-5 w-5" />}
						count={stats.total}
						label="Total"
						colorClass="bg-primary/10 text-primary"
					/>
					<StatCard
						icon={<CheckCircle2 className="h-5 w-5" />}
						count={stats.confirmed}
						label="Confirmadas"
						colorClass="bg-green-500/10 text-green-500"
					/>
					<StatCard
						icon={<Clock className="h-5 w-5" />}
						count={stats.pending}
						label="Pendentes"
						colorClass="bg-yellow-500/10 text-yellow-600"
					/>
					<StatCard
						icon={<XCircle className="h-5 w-5" />}
						count={stats.canceled}
						label="Canceladas"
						colorClass="bg-red-500/10 text-red-500"
					/>
				</div>
			)}

			{/* Upcoming appointments */}
			{(isProfessional || isPatient) && (
				<AppointmentsList
					appointments={upcoming}
					isProfessional={isProfessional}
					onConfirm={(id) => confirm(id)}
					onComplete={(id) => complete(id)}
				/>
			)}

			{/* Quick access */}
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{cards.map((card) => (
					<QuickAccessCard key={card.href} {...card} />
				))}
			</div>

			{/* Patient CTA to become professional */}
			{isPatient && (
				<Link href="/dashboard/become-professional" className="group block">
					<Card className="border-dashed border-border transition-all hover:border-primary/40 hover:shadow-sm">
						<CardContent className="flex items-center gap-4 p-5">
							<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
								<BadgeCheck className="h-5 w-5" />
							</div>
							<div className="flex-1">
								<p className="font-semibold text-foreground">
									É profissional de saúde?
								</p>
								<p className="text-xs text-muted-foreground">
									Cadastre-se como profissional de saúde e comece a atender
									pacientes.
								</p>
							</div>
							<ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
						</CardContent>
					</Card>
				</Link>
			)}
		</div>
	);
}
