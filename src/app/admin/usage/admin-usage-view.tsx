"use client";

import {
	BadgeCheck,
	CalendarDays,
	DollarSign,
	TrendingUp,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePermission } from "@/components/auth/hooks";
import { ErrorState } from "@/components/custom/error-state/error-state";
import { LoadingPage } from "@/components/custom/loading/loading-page";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "./stat-card";
import { useUsageStats } from "./use-usage-stats";

function UsageStatsContent() {
	const { totalUsers, stats, isLoading, error, refetch } = useUsageStats();

	if (isLoading) {
		return <LoadingPage />;
	}

	if (error) {
		return <ErrorState onRetry={() => refetch()} />;
	}

	return (
		<>
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
								{Math.round((stats.completed / stats.totalAppointments) * 100)}%
								do total
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
								{Math.round((stats.cancelled / stats.totalAppointments) * 100)}%
								do total
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}

export function AdminUsageView() {
	const { can } = usePermission();
	const router = useRouter();

	useEffect(() => {
		if (!can("admin:access")) router.push("/dashboard");
	}, [can, router]);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Uso da Plataforma"
				description="Métricas e estatísticas gerais do sistema."
				icon={<BadgeCheck className="h-6 w-6" />}
			/>

			<SuspenseBoundary>
				<UsageStatsContent />
			</SuspenseBoundary>
		</div>
	);
}
