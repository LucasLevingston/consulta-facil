"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	AlertCircle,
	ArrowLeft,
	Briefcase,
	CalendarDays,
	CheckCircle2,
	CreditCard,
	FileText,
	Mail,
	Phone,
	Pill,
	Shield,
	TrendingUp,
	User,
	UserRound,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { usePatientAppointments } from "@/hooks/api/appointments/use-patient-appointments";
import { useMedicalRecords } from "@/hooks/api/patients/use-medical-records";
import { usePatientProfile } from "@/hooks/api/patients/use-patient-profile";
import type { AppointmentResponse } from "@/lib/schemas/appointment.schema";
import { formatDateTime } from "@/lib/utils/format-date-time";

function PatientScoreCard({
	appointments,
}: {
	appointments: AppointmentResponse[];
}) {
	const completed = appointments.filter((a) => a.status === "COMPLETED").length;
	const canceled = appointments.filter((a) => a.status === "CANCELED").length;
	const total = appointments.length;
	const decisive = completed + canceled;

	const attendanceRate =
		decisive > 0 ? Math.round((completed / decisive) * 100) : null;

	const withPayment = appointments.filter(
		(a) => a.paymentStatus === "PAID" || a.paymentStatus === "PENDING_PAYMENT",
	);
	const paid = withPayment.filter((a) => a.paymentStatus === "PAID").length;
	const paymentRate =
		withPayment.length > 0
			? Math.round((paid / withPayment.length) * 100)
			: null;

	const score =
		attendanceRate !== null && paymentRate !== null
			? Math.round(attendanceRate * 0.6 + paymentRate * 0.4)
			: (attendanceRate ?? paymentRate ?? null);

	if (total === 0) return null;

	const scoreColor =
		score === null
			? "text-muted-foreground"
			: score >= 80
				? "text-green-600 dark:text-green-400"
				: score >= 50
					? "text-yellow-600 dark:text-yellow-400"
					: "text-red-600 dark:text-red-400";

	const scoreBg =
		score === null
			? "bg-muted/30"
			: score >= 80
				? "bg-green-500/10"
				: score >= 50
					? "bg-yellow-500/10"
					: "bg-red-500/10";

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base flex items-center gap-2">
					<TrendingUp className="h-4 w-4" />
					Score do paciente
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
					{score !== null && (
						<div
							className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl ${scoreBg}`}
						>
							<span className={`text-3xl font-bold ${scoreColor}`}>
								{score}
							</span>
							<span className="text-xs text-muted-foreground">/ 100</span>
						</div>
					)}

					<div className="flex flex-1 flex-wrap gap-4">
						{attendanceRate !== null && (
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10">
									<CheckCircle2 className="h-4 w-4 text-green-600" />
								</div>
								<div>
									<p className="text-xs text-muted-foreground">
										Comparecimento
									</p>
									<p className="font-semibold text-foreground">
										{attendanceRate}%
									</p>
									<p className="text-xs text-muted-foreground">
										{completed}/{decisive} consultas
									</p>
								</div>
							</div>
						)}

						{paymentRate !== null && (
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
									<CreditCard className="h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Pagamentos</p>
									<p className="font-semibold text-foreground">
										{paymentRate}%
									</p>
									<p className="text-xs text-muted-foreground">
										{paid}/{withPayment.length} pagos
									</p>
								</div>
							</div>
						)}

						{canceled > 0 && (
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10">
									<XCircle className="h-4 w-4 text-red-500" />
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Cancelamentos</p>
									<p className="font-semibold text-foreground">{canceled}</p>
									<p className="text-xs text-muted-foreground">
										de {total} consultas
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function genderLabel(gender?: string | null) {
	if (gender === "MALE") return "Masculino";
	if (gender === "FEMALE") return "Feminino";
	if (gender === "OTHER") return "Outro";
	return null;
}

function InfoRow({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ElementType;
	label: string;
	value?: string | null;
}) {
	if (!value) return null;
	return (
		<div className="flex items-center gap-3 text-sm">
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
				<Icon className="h-4 w-4 text-primary" />
			</div>
			<div>
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="font-medium text-foreground">{value}</p>
			</div>
		</div>
	);
}

export default function PatientDetailPage() {
	const { id } = useParams<{ id: string }>();

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

	const consentCount = [
		medicalRecord?.privacyConsent,
		medicalRecord?.treatmentConsent,
		medicalRecord?.disclosureConsent,
	].filter(Boolean).length;

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<Button variant="ghost" size="sm" className="gap-2 -ml-2" asChild>
				<Link href="/dashboard/patients">
					<ArrowLeft className="h-4 w-4" />
					Voltar para pacientes
				</Link>
			</Button>

			{/* Hero */}
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

			{/* Contact info */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<User className="h-4 w-4" />
						Informações pessoais
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<InfoRow icon={Mail} label="E-mail" value={patient.email} />
					{patient.phone && <Separator />}
					<InfoRow icon={Phone} label="Telefone" value={patient.phone} />
					{patient.cpf && <Separator />}
					<InfoRow icon={Shield} label="CPF" value={patient.cpf} />
					{patient.birthDate && <Separator />}
					<InfoRow
						icon={CalendarDays}
						label="Data de nascimento"
						value={
							patient.birthDate
								? format(new Date(patient.birthDate), "dd/MM/yyyy", {
										locale: ptBR,
									})
								: null
						}
					/>
					{patient.gender && <Separator />}
					<InfoRow
						icon={User}
						label="Gênero"
						value={genderLabel(patient.gender)}
					/>
					{patient.occupation && <Separator />}
					<InfoRow
						icon={Briefcase}
						label="Ocupação"
						value={patient.occupation}
					/>
				</CardContent>
			</Card>

			{/* Medical records */}
			{medicalRecord && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base flex items-center gap-2">
							<FileText className="h-4 w-4" />
							Prontuário médico
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{medicalRecord.allergies && (
							<div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3">
								<div className="flex items-center gap-2 mb-1">
									<AlertCircle className="h-4 w-4 text-destructive" />
									<p className="text-xs font-semibold text-destructive">
										Alergias
									</p>
								</div>
								<p className="text-sm">{medicalRecord.allergies}</p>
							</div>
						)}

						{medicalRecord.currentMedication && (
							<div>
								<div className="flex items-center gap-2 mb-1">
									<Pill className="h-4 w-4 text-muted-foreground" />
									<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
										Medicação atual
									</p>
								</div>
								<p className="text-sm text-foreground">
									{medicalRecord.currentMedication}
								</p>
							</div>
						)}

						{medicalRecord.pastMedicalHistory && (
							<>
								<Separator />
								<div>
									<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
										Histórico médico
									</p>
									<p className="text-sm text-foreground">
										{medicalRecord.pastMedicalHistory}
									</p>
								</div>
							</>
						)}

						{medicalRecord.familyMedicalHistory && (
							<>
								<Separator />
								<div>
									<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
										Histórico familiar
									</p>
									<p className="text-sm text-foreground">
										{medicalRecord.familyMedicalHistory}
									</p>
								</div>
							</>
						)}

						{consentCount > 0 && (
							<>
								<Separator />
								<div className="flex flex-wrap gap-2">
									{medicalRecord.privacyConsent && (
										<Badge variant="outline" className="text-xs gap-1">
											<Shield className="h-3 w-3" /> Privacidade
										</Badge>
									)}
									{medicalRecord.treatmentConsent && (
										<Badge variant="outline" className="text-xs gap-1">
											<Shield className="h-3 w-3" /> Tratamento
										</Badge>
									)}
									{medicalRecord.disclosureConsent && (
										<Badge variant="outline" className="text-xs gap-1">
											<Shield className="h-3 w-3" /> Divulgação
										</Badge>
									)}
								</div>
							</>
						)}
					</CardContent>
				</Card>
			)}

			{/* Appointments */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<CalendarDays className="h-4 w-4" />
						Histórico de consultas
					</CardTitle>
				</CardHeader>
				<CardContent>
					{appointments.length === 0 ? (
						<div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border">
							<p className="text-sm text-muted-foreground">
								Nenhuma consulta registrada.
							</p>
						</div>
					) : (
						<div className="space-y-2">
							{appointments.map((appt) => (
								<div
									key={appt.id}
									className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/60 p-3 sm:flex-row sm:items-center sm:justify-between"
								>
									<div>
										<p className="text-sm font-medium">
											{appt.reason ?? "Sem motivo informado"}
										</p>
										<p className="text-xs text-muted-foreground">
											{formatDateTime(new Date(appt.scheduledAt)).dateTime}
											{appt.professionalName && ` · ${appt.professionalName}`}
										</p>
										{appt.specialty && (
											<Badge variant="outline" className="mt-1 text-xs">
												{appt.specialty}
											</Badge>
										)}
									</div>
									<StatusBadge status={appt.status} />
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
