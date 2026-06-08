"use client";

import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { PatientAppointmentHistory } from "@/components/patients/detail/PatientAppointmentHistory";
import { PatientInfoCard } from "@/components/patients/detail/PatientInfoCard";
import { PatientMedicalRecord } from "@/components/patients/detail/PatientMedicalRecord";
import { PatientScoreCard } from "@/components/patients/detail/PatientScoreCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePatientAppointments } from "@/hooks/api/appointments/use-patient-appointments";
import { useMedicalRecords } from "@/hooks/api/patients/use-medical-records";
import { usePatientProfile } from "@/hooks/api/patients/use-patient-profile";

const TABS = ["info", "prontuario", "consultas"] as const;
type Tab = (typeof TABS)[number];

function isValidTab(v: string | null): v is Tab {
	return TABS.includes(v as Tab);
}

export function PatientDetailContent({ id }: { id: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const activeTab: Tab = isValidTab(searchParams.get("tab"))
		? (searchParams.get("tab") as Tab)
		: "info";

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

	function setTab(tab: Tab) {
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

			<Card className="overflow-hidden">
				<div className="h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20" />
				<CardContent className="relative pt-0 pb-6 px-6">
					<div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<Avatar className="size-20 rounded-2xl border-4 border-card shadow-md">
							<AvatarImage
								src={patient.imageUrl ?? undefined}
								alt={patient.name ?? "Paciente"}
							/>
							<AvatarFallback className="rounded-2xl bg-primary/15 text-primary font-bold text-2xl">
								{initials}
							</AvatarFallback>
						</Avatar>
						<div className="flex gap-2 shrink-0">
							<Badge variant="secondary" className="gap-1.5">
								<CalendarDays className="h-3 w-3" />
								{appointments.length}{" "}
								{appointments.length === 1 ? "consulta" : "consultas"}
							</Badge>
						</div>
					</div>
					<div className="mt-4">
						<h1 className="text-2xl font-bold">{patient.name}</h1>
						{patient.occupation && (
							<p className="text-sm text-muted-foreground mt-0.5">
								{patient.occupation}
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			<PatientScoreCard appointments={appointments} />

			<Tabs value={activeTab} onValueChange={(v) => setTab(v as Tab)}>
				<TabsList className="w-full">
					<TabsTrigger value="info" className="flex-1">
						Informações
					</TabsTrigger>
					<TabsTrigger value="prontuario" className="flex-1">
						Prontuário
					</TabsTrigger>
					<TabsTrigger value="consultas" className="flex-1">
						Consultas
					</TabsTrigger>
				</TabsList>

				<TabsContent value="info" className="mt-4">
					<PatientInfoCard patient={patient} />
				</TabsContent>

				<TabsContent value="prontuario" className="mt-4">
					{medicalRecord ? (
						<PatientMedicalRecord medicalRecord={medicalRecord} />
					) : (
						<p className="text-sm text-muted-foreground text-center py-8">
							Nenhum prontuário registrado.
						</p>
					)}
				</TabsContent>

				<TabsContent value="consultas" className="mt-4">
					<PatientAppointmentHistory appointments={appointments} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
