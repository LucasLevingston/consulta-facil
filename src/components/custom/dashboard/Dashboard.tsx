"use client";

import { useMemo } from "react";
import {
	useCompleteAppointment,
	useConfirmAppointment,
	usePatientAppointments,
	useProfessionalAppointments,
} from "@/features/appointments";
import { useUserStore } from "@/features/auth";
import { useMyProfessionalProfile } from "@/features/professionals";
import { adminCards } from "./admin-cards";
import type { DashboardProps } from "./Dashboard.types";
import { DashboardHero } from "./DashboardHero";
import { DashboardStatsSection } from "./DashboardStatsSection";
import { PatientCtaCard } from "./PatientCtaCard";
import { patientCards } from "./patient-cards";
import { professionalCards } from "./professional-cards";
import { QuickAccessCard } from "./QuickAccessCard";

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
			<DashboardHero
				firstName={firstName}
				heroLabel={heroLabel}
				isProfessional={isProfessional}
				isPatient={isPatient}
				isAdmin={isAdmin}
			/>
			{(isProfessional || isPatient) && (
				<DashboardStatsSection
					stats={stats}
					upcoming={upcoming}
					isProfessional={isProfessional}
					onConfirm={(id) => confirm(id)}
					onComplete={(id) => complete(id)}
				/>
			)}
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{cards.map((card) => (
					<QuickAccessCard key={card.href} {...card} />
				))}
			</div>
			{isPatient && <PatientCtaCard />}
		</div>
	);
}
