"use client";

import {
	CalendarCheck,
	CalendarClock,
	CalendarDays,
	Clock,
	Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMyDoctorProfile } from "@/hooks/api/doctors/use-my-doctor-profile";
import {
	useCompleteAppointment,
	useConfirmAppointment,
	useDoctorAppointments,
	usePatientAppointments,
} from "@/hooks/api/use-appointments";
import { toast } from "@/hooks/use-toast";
import type { AppointmentResponse } from "@/lib/schemas/appointment.schema";
import { QueryBoundary } from "@/providers/query-boundary";

import { AppointmentsList } from "./appointments-list";
import { StatCard } from "./stat-card";

interface DashboardProps {
	firstName: string;
	userId: string;
	isDoctor: boolean;
}

function stats(appointments: AppointmentResponse[]) {
	return {
		total: appointments.length,
		pending: appointments.filter((a) => a.status === "PENDING"),
		confirmed: appointments.filter((a) => a.status === "CONFIRMED"),
		completed: appointments.filter((a) => a.status === "COMPLETED"),
		recent: [...appointments]
			.sort(
				(a, b) =>
					new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
			)
			.slice(0, 5),
	};
}

interface DashboardLayoutProps {
	firstName: string;
	isDoctor: boolean;
	subtitle?: string;
	appointments: AppointmentResponse[];
	onConfirm?: (id: string) => void;
	onComplete?: (id: string) => void;
}

function DashboardLayout({
	firstName,
	isDoctor,
	subtitle,
	appointments,
	onConfirm,
	onComplete,
}: DashboardLayoutProps) {
	const { pending, confirmed, completed, recent } = stats(appointments);

	return (
		<div className="space-y-6">
			{/* Hero */}
			<div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 sm:p-8">
				<div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
				<div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />
				<div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm font-medium text-primary">
							{isDoctor ? "Painel do médico" : "Bem-vindo de volta"}
						</p>
						<h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
							Olá, {isDoctor ? `Dr. ${firstName}` : firstName}!
						</h1>
						{subtitle && (
							<p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
						)}
						<p className="mt-1 text-sm text-muted-foreground">
							{isDoctor ? (
								<>
									<span className="font-semibold text-foreground">
										{pending.length}
									</span>{" "}
									consulta{pending.length !== 1 ? "s" : ""} aguardando
									confirmação.
								</>
							) : (
								<>
									Você tem{" "}
									<span className="font-semibold text-foreground">
										{pending.length}
									</span>{" "}
									consulta{pending.length !== 1 ? "s" : ""} pendente
									{pending.length !== 1 ? "s" : ""} e{" "}
									<span className="font-semibold text-foreground">
										{confirmed.length}
									</span>{" "}
									confirmada{confirmed.length !== 1 ? "s" : ""}.
								</>
							)}
						</p>
					</div>
					{!isDoctor && (
						<Link href="/dashboard/appointments/create">
							<Button className="shrink-0 gap-2">
								<Stethoscope className="h-4 w-4" />
								Agendar consulta
							</Button>
						</Link>
					)}
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				<StatCard
					icon={<CalendarDays className="h-5 w-5" />}
					count={appointments.length}
					label="Total"
					colorClass="bg-primary/10 text-primary"
				/>
				<StatCard
					icon={<Clock className="h-5 w-5" />}
					count={pending.length}
					label="Pendentes"
					colorClass="bg-yellow-500/10 text-yellow-500"
				/>
				<StatCard
					icon={<CalendarCheck className="h-5 w-5" />}
					count={confirmed.length}
					label="Confirmadas"
					colorClass="bg-green-500/10 text-green-500"
				/>
				<StatCard
					icon={<CalendarClock className="h-5 w-5" />}
					count={completed.length}
					label="Concluídas"
					colorClass="bg-blue-500/10 text-blue-500"
				/>
			</div>

			{/* List — receives already-processed data from parent */}
			<AppointmentsList
				appointments={recent}
				isDoctor={isDoctor}
				onConfirm={onConfirm}
				onComplete={onComplete}
			/>
		</div>
	);
}

function DoctorDashboard({ firstName }: { firstName: string }) {
	const doctorProfile = useMyDoctorProfile(true);
	const doctorId = doctorProfile.data?.id ?? "";
	const query = useDoctorAppointments(doctorId);
	const confirm = useConfirmAppointment();
	const complete = useCompleteAppointment();

	async function handleConfirm(id: string) {
		try {
			await confirm.mutateAsync(id);
			toast({ title: "Consulta confirmada!" });
		} catch {
			toast({ title: "Erro ao confirmar consulta.", variant: "destructive" });
		}
	}

	async function handleComplete(id: string) {
		try {
			await complete.mutateAsync(id);
			toast({ title: "Consulta concluída!" });
		} catch {
			toast({ title: "Erro ao concluir consulta.", variant: "destructive" });
		}
	}

	return (
		<QueryBoundary
			isLoading={doctorProfile.isLoading || query.isLoading}
			error={query.error}
		>
			<DashboardLayout
				firstName={firstName}
				isDoctor
				appointments={query.data?.content ?? []}
				subtitle={
					doctorProfile.data
						? `${doctorProfile.data.specialty} · CRM ${doctorProfile.data.licenseNumber}`
						: undefined
				}
				onConfirm={handleConfirm}
				onComplete={handleComplete}
			/>
		</QueryBoundary>
	);
}

function PatientDashboard({
	firstName,
	userId,
}: {
	firstName: string;
	userId: string;
}) {
	const query = usePatientAppointments(userId);

	return (
		<QueryBoundary isLoading={query.isLoading} error={query.error}>
			<DashboardLayout
				firstName={firstName}
				isDoctor={false}
				appointments={query.data?.content ?? []}
			/>
		</QueryBoundary>
	);
}

export function Dashboard({ firstName, userId, isDoctor }: DashboardProps) {
	if (isDoctor) return <DoctorDashboard firstName={firstName} />;
	return <PatientDashboard firstName={firstName} userId={userId} />;
}
