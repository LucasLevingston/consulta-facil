"use client";

import { adminCards } from "./admin-cards";
import type { DashboardProps } from "./Dashboard.types";
import { DashboardHero } from "./DashboardHero";
import { DashboardStatsSection } from "./DashboardStatsSection";
import { PatientCtaCard } from "./PatientCtaCard";
import { patientCards } from "./patient-cards";
import { professionalCards } from "./professional-cards";
import { QuickAccessCard } from "./QuickAccessCard";
import { useDashboardData } from "./useDashboardData";

export function Dashboard({ firstName, userRole }: DashboardProps) {
	const isProfessional = userRole === "PROFESSIONAL";
	const isAdmin = userRole === "ADMIN";
	const isPatient = userRole === "PATIENT";
	const { stats, upcoming, confirm, complete } = useDashboardData(
		isProfessional,
		isPatient,
	);

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
