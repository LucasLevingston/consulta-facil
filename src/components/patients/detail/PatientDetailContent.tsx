"use client";

import { ArrowLeft, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePatientAppointments } from "@/components/appointments/hooks";
import { PatientScoreCard } from "@/components/patients/detail/PatientScoreCard";
import { useMedicalRecords } from "@/components/patients/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { PatientDetailContentProps } from "./PatientDetailContent.types";
import { PatientDetailTabs } from "./PatientDetailTabs";
import { PatientProfileCard } from "./PatientProfileCard";
import { usePatientProfile } from "./use-patient-profile";

const TABS = ["info", "prontuario", "consultas"] as const;
type Tab = (typeof TABS)[number];

export function PatientDetailContent({ id }: PatientDetailContentProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const tab = searchParams.get("tab");
	const activeTab: Tab = TABS.includes(tab as Tab) ? (tab as Tab) : "info";

	const { data: patient, isLoading: loadingProfile } = usePatientProfile(id);
	const { data: appointmentsPage, isLoading: loadingApps } =
		usePatientAppointments(id);
	const { data: medicalRecord, isLoading: loadingMedical } =
		useMedicalRecords(id);

	const isLoading = loadingProfile || loadingApps || loadingMedical;

	if (isLoading) {
		return (
			<div className="max-w-3xl mx-auto space-y-6">
				<Skeleton className="h-10 w-32" />
				<Skeleton className="h-48 w-full rounded-3xl" />
				<Skeleton className="h-40 w-full rounded-2xl" />
				<Skeleton className="h-64 w-full rounded-2xl" />
			</div>
		);
	}

	if (!patient) {
		return (
			<div className="flex flex-col items-center justify-center py-24 text-center gap-4">
				<UserRound className="h-12 w-12 text-muted-foreground/40" />
				<h2 className="text-xl font-semibold">Paciente não encontrado</h2>
				<p className="text-muted-foreground text-sm">
					O paciente que você está procurando não existe ou foi removido.
				</p>
				<Button variant="outline" asChild>
					<Link href="/dashboard/patients">Ver todos os pacientes</Link>
				</Button>
			</div>
		);
	}

	const initials = patient.name
		? patient.name
				.split(" ")
				.map((n: string) => n[0])
				.join("")
				.slice(0, 2)
				.toUpperCase()
		: "PA";
	const appointments = appointmentsPage?.content ?? [];

	function setTab(tab: string) {
		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", tab);
		router.replace(`?${params.toString()}`, { scroll: false });
	}

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<Button variant="ghost" size="sm" className="gap-2 -ml-2" asChild>
				<Link href="/dashboard/patients">
					<ArrowLeft className="h-4 w-4" />
					Voltar para pacientes
				</Link>
			</Button>
			<PatientProfileCard
				patient={patient}
				initials={initials}
				appointmentsCount={appointments.length}
			/>
			<PatientScoreCard appointments={appointments} />
			<PatientDetailTabs
				patient={patient}
				appointments={appointments}
				medicalRecord={medicalRecord}
				activeTab={activeTab}
				onTabChange={setTab}
			/>
		</div>
	);
}
