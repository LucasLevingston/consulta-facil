"use client";

import {
	ArrowRight,
	BadgeCheck,
	CalendarDays,
	CalendarPlus,
	CreditCard,
	LayoutDashboard,
	Stethoscope,
	User,
	UserRound,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useMyProfessionalProfile } from "@/hooks/api/doctors/use-my-doctor-profile";

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
		title: "Minhas Consultas",
		description: "Veja o histórico e status das suas consultas.",
		href: "/dashboard/appointments",
		icon: CalendarDays,
		accent: "bg-primary/10 text-primary",
	},
	{
		title: "Agendar Consulta",
		description: "Escolha um profissional e agende um horário.",
		href: "/dashboard/appointments/create",
		icon: CalendarPlus,
		accent: "bg-green-500/10 text-green-500",
	},
	{
		title: "Profissionais",
		description: "Explore médicos cadastrados na plataforma.",
		href: "/professionals",
		icon: Stethoscope,
		accent: "bg-blue-500/10 text-blue-500",
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
		title: "Minhas Consultas",
		description: "Gerencie e confirme suas consultas agendadas.",
		href: "/dashboard/appointments",
		icon: CalendarDays,
		accent: "bg-primary/10 text-primary",
	},
	{
		title: "Meus Pacientes",
		description: "Veja o histórico e perfil dos seus pacientes.",
		href: "/dashboard/patients",
		icon: UserRound,
		accent: "bg-green-500/10 text-green-500",
	},
	{
		title: "Meu Perfil",
		description: "Atualize seus dados e foto de perfil.",
		href: "/dashboard/profile",
		icon: User,
		accent: "bg-purple-500/10 text-purple-500",
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
		title: "Consultas",
		description: "Visão geral de todas as consultas.",
		href: "/dashboard/appointments",
		icon: CalendarDays,
		accent: "bg-primary/10 text-primary",
	},
	{
		title: "Pacientes",
		description: "Gerencie os pacientes cadastrados.",
		href: "/dashboard/patients",
		icon: UserRound,
		accent: "bg-green-500/10 text-green-500",
	},
	{
		title: "Profissionais",
		description: "Veja todos os médicos da plataforma.",
		href: "/professionals",
		icon: Stethoscope,
		accent: "bg-blue-500/10 text-blue-500",
	},
	{
		title: "Painel Admin",
		description: "Acesso às configurações administrativas.",
		href: "/admin",
		icon: LayoutDashboard,
		accent: "bg-red-500/10 text-red-500",
	},
];

interface DashboardProps {
	firstName: string;
	role: "PATIENT" | "PROFESSIONAL" | "ADMIN";
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
	const isDoctor = role === "PROFESSIONAL";
	const isAdmin = role === "ADMIN";
	const isPatient = role === "PATIENT";

	const cards = isAdmin ? adminCards : isDoctor ? doctorCards : patientCards;

	const heroLabel = isAdmin
		? "Painel administrativo"
		: isDoctor
			? "Painel do profissional"
			: "Bem-vindo de volta";

	const heroName = isDoctor ? `Dr. ${firstName}` : firstName;

	return (
		<div className="space-y-6">
			{/* Hero */}
			<div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 sm:p-8">
				<div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
				<div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />
				<div className="relative z-10">
					<p className="text-sm font-medium text-primary">{heroLabel}</p>
					<h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
						Olá, {heroName}!
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

			{/* Quick access cards */}
			<div className="grid gap-3 sm:grid-cols-2">
				{cards.map((card) => (
					<QuickAccessCard key={card.href} {...card} />
				))}
			</div>

			{/* Patient CTA to become doctor */}
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
