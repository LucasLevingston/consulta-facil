"use client";

import {
	ArrowRight,
	BadgeCheck,
	Building2,
	CalendarDays,
	CalendarPlus,
	CheckCircle2,
	Clock,
	CreditCard,
	LayoutDashboard,
	Stethoscope,
	TrendingUp,
	User,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useMyProfessionalProfile } from "@/hooks/api/doctors/use-my-doctor-profile";
import {
	useCompleteAppointment,
	useConfirmAppointment,
	usePatientAppointments,
	useProfessionalAppointments,
} from "@/hooks/api/use-appointments";
import { useUserStore } from "@/store/useUserStore";
import { AppointmentsList } from "./appointments-list";
import { StatCard } from "./stat-card";

interface QuickCard {
	title: string;
	description: string;
	href: string;
	icon: React.ElementType;
	accent: string;
}

function QuickAccessCard({
	title,
	description,
	href,
	icon: Icon,
	accent,
}: QuickCard) {
	return (
		<Link href={href} className="group block">
			<Card className="h-full border-border transition-all hover:border-primary/40 hover:shadow-md">
				<CardContent className="flex items-start gap-4 p-5">
					<div
						className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accent}`}
					>
						<Icon className="h-5 w-5" />
					</div>
					<div className="min-w-0 flex-1">
						<p className="font-semibold text-foreground">{title}</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							{description}
						</p>
					</div>
					<ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
				</CardContent>
			</Card>
		</Link>
	);
}

const patientCards: QuickCard[] = [
	{
		title: "Agendar Consulta",
		description: "Escolha um profissional e agende um horário.",
		href: "/dashboard/appointments/create",
		icon: CalendarPlus,
		accent: "bg-green-500/10 text-green-500",
	},
	{
		title: "Profissionais",
		description: "Explore profissionais cadastrados na plataforma.",
		href: "/professionals",
		icon: Stethoscope,
		accent: "bg-blue-500/10 text-blue-500",
	},
	{
		title: "Clínicas",
		description: "Encontre clínicas próximas de você.",
		href: "/clinics",
		icon: Building2,
		accent: "bg-teal-500/10 text-teal-500",
	},
	{
		title: "Meu Perfil",
		description: "Atualize seus dados pessoais e preferências.",
		href: "/dashboard/profile",
		icon: User,
		accent: "bg-purple-500/10 text-purple-500",
	},
];

const doctorCards: QuickCard[] = [
	{
		title: "Agendar Consulta",
		description: "Marque uma nova consulta para um paciente.",
		href: "/dashboard/appointments/create",
		icon: CalendarPlus,
		accent: "bg-green-500/10 text-green-500",
	},
	{
		title: "Horários",
		description: "Gerencie sua disponibilidade semanal.",
		href: "/dashboard/schedule",
		icon: Clock,
		accent: "bg-blue-500/10 text-blue-500",
	},
	{
		title: "Financeiro",
		description: "Acompanhe sua receita e pagamentos.",
		href: "/dashboard/financial",
		icon: TrendingUp,
		accent: "bg-emerald-500/10 text-emerald-500",
	},
	{
		title: "Minha Clínica",
		description: "Gerencie sua clínica e membros.",
		href: "/dashboard/my-clinic",
		icon: Building2,
		accent: "bg-teal-500/10 text-teal-500",
	},
	{
		title: "Assinatura",
		description: "Gerencie seu plano e faturamento.",
		href: "/settings/billing",
		icon: CreditCard,
		accent: "bg-orange-500/10 text-orange-500",
	},
];

const adminCards: QuickCard[] = [
	{
		title: "Painel Admin",
		description: "Acesso às configurações administrativas.",
		href: "/admin",
		icon: LayoutDashboard,
		accent: "bg-red-500/10 text-red-500",
	},
	{
		title: "Profissionais",
		description: "Veja todos os profissionais da plataforma.",
		href: "/professionals",
		icon: Stethoscope,
		accent: "bg-blue-500/10 text-blue-500",
	},
];

interface DashboardProps {
	firstName: string;
	role: "PATIENT" | "PROFESSIONAL" | "ADMIN" | "RECEPTIONIST";
}

function DoctorHeroSubtitle() {
	const { data } = useMyProfessionalProfile(true);
	if (!data) return null;
	return (
		<p className="mt-1 text-sm text-muted-foreground">
			{data.specialty}
			{data.licenseNumber ? ` · CRM ${data.licenseNumber}` : ""}
		</p>
	);
}

export function Dashboard({ firstName, role }: DashboardProps) {
	const { user } = useUserStore();
	const isDoctor = role === "PROFESSIONAL";
	const isAdmin = role === "ADMIN";
	const isPatient = role === "PATIENT";

	const { data: doctorProfile } = useMyProfessionalProfile(isDoctor);
	const professionalId = doctorProfile?.id ?? "";

	const patientQuery = usePatientAppointments(
		isPatient ? (user?.id ?? "") : "",
	);
	const doctorQuery = useProfessionalAppointments(
		isDoctor ? professionalId : "",
	);

	const { mutateAsync: confirm } = useConfirmAppointment();
	const { mutateAsync: complete } = useCompleteAppointment();

	const appointments = isDoctor
		? (doctorQuery.data?.content ?? [])
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
			.slice(0, isDoctor ? 5 : 3);
	}, [appointments, isDoctor]);

	const cards = isAdmin ? adminCards : isDoctor ? doctorCards : patientCards;

	const heroLabel = isAdmin
		? "Painel administrativo"
		: isDoctor
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
					{isDoctor && <DoctorHeroSubtitle />}
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
			{(isDoctor || isPatient) && (
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
			{(isDoctor || isPatient) && (
				<AppointmentsList
					appointments={upcoming}
					isDoctor={isDoctor}
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
