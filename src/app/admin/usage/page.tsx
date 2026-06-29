"use client";

import {
	BadgeCheck,
	CalendarDays,
	DollarSign,
	TrendingUp,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import PageHeader from "@/components/custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllAdminAppointments } from "@/features/appointments";
import { useAllUsers } from "@/features/users";
import { usePermission } from "@/hooks/use-permission";
import { QueryBoundary } from "@/providers/query-boundary";

function StatCard({
	title,
	value,
	sub,
	icon,
}: {
	title: string;
	value: string | number;
	sub?: string;
	icon: React.ReactNode;
}) {
	return (
		<Card>
			<CardContent className="p-5">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-muted-foreground">{title}</p>
						<p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
						{sub && (
							<p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
						)}
					</div>
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
						{icon}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default function AdminUsagePage() {
	const { can } = usePermission();
	const router = useRouter();

	useEffect(() => {
		if (!can("admin:access")) router.push("/dashboard");
	}, [can, router]);

	const appointmentsQuery = useAllAdminAppointments(0, 1000);
	const usersQuery = useAllUsers(0, 1000);

	const appointments = appointmentsQuery.data?.content ?? [];
	const totalUsers = usersQuery.data?.totalElements ?? 0;

	const stats = useMemo(() => {
		const totalAppointments = appointmentsQuery.data?.totalElements ?? 0;
		const completed = appointments.filter(
			(a) => a.status === "COMPLETED",
		).length;
		const pending = appointments.filter((a) => a.status === "PENDING").length;
		const cancelled = appointments.filter(
			(a) => a.status === "CANCELED",
		).length;

		const totalRevenue = appointments
			.filter((a) => a.paymentStatus === "PAID")
			.reduce((sum, a) => sum + (a.paymentAmount ?? 0), 0);

		const avgTicket =
			completed > 0
				? appointments
						.filter((a) => a.status === "COMPLETED" && a.paymentAmount)
						.reduce((sum, a) => sum + (a.paymentAmount ?? 0), 0) / completed
				: 0;

		const professionals = new Set(
			appointments.map((a) => a.professionalName).filter(Boolean),
		).size;

		return {
			totalAppointments,
			completed,
			pending,
			cancelled,
			totalRevenue,
			avgTicket,
			professionals,
		};
	}, [appointments, appointmentsQuery.data?.totalElements]);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Uso da Plataforma"
				description="Métricas e estatísticas gerais do sistema."
				icon={<BadgeCheck className="h-6 w-6" />}
			/>

			<QueryBoundary
				isLoading={appointmentsQuery.isLoading || usersQuery.isLoading}
				error={appointmentsQuery.error ?? usersQuery.error}
			>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<StatCard
						title="Total de usuários"
						value={totalUsers}
						icon={<Users className="h-5 w-5" />}
					/>
					<StatCard
						title="Total de consultas"
						value={stats.totalAppointments}
						sub={`${stats.completed} concluídas · ${stats.pending} pendentes`}
						icon={<CalendarDays className="h-5 w-5" />}
					/>
					<StatCard
						title="Receita total"
						value={stats.totalRevenue.toLocaleString("pt-BR", {
							style: "currency",
							currency: "BRL",
						})}
						sub="consultas pagas"
						icon={<DollarSign className="h-5 w-5" />}
					/>
					<StatCard
						title="Ticket médio"
						value={stats.avgTicket.toLocaleString("pt-BR", {
							style: "currency",
							currency: "BRL",
						})}
						sub={`${stats.professionals} profissionais ativos`}
						icon={<TrendingUp className="h-5 w-5" />}
					/>
				</div>

				<div className="grid gap-4 sm:grid-cols-3">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Consultas concluídas
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-3xl font-bold text-foreground">
								{stats.completed}
							</p>
							{stats.totalAppointments > 0 && (
								<p className="mt-1 text-xs text-muted-foreground">
									{Math.round(
										(stats.completed / stats.totalAppointments) * 100,
									)}
									% do total
								</p>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Consultas pendentes
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-3xl font-bold text-foreground">
								{stats.pending}
							</p>
							{stats.totalAppointments > 0 && (
								<p className="mt-1 text-xs text-muted-foreground">
									{Math.round((stats.pending / stats.totalAppointments) * 100)}%
									do total
								</p>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Consultas canceladas
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-3xl font-bold text-foreground">
								{stats.cancelled}
							</p>
							{stats.totalAppointments > 0 && (
								<p className="mt-1 text-xs text-muted-foreground">
									{Math.round(
										(stats.cancelled / stats.totalAppointments) * 100,
									)}
									% do total
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			</QueryBoundary>
		</div>
	);
}
