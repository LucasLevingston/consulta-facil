"use client";

import { BadgeCheck, Layers, Loader2, PowerOff } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { PlanResponse } from "@/features/plans";
import { useAdminDeactivatePlan, useAdminPlans } from "@/features/plans";

const PERIOD_LABELS: Record<string, string> = {
	MONTHLY: "Mensal",
	SEMIANNUAL: "Semestral",
	ANNUAL: "Anual",
};

function formatBRL(value: number) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
}

export default function AdminPlansPage() {
	const { data: plans = [], isLoading } = useAdminPlans();
	const deactivate = useAdminDeactivatePlan();

	function handleDeactivate(plan: PlanResponse) {
		deactivate.mutate(plan.id, {
			onSuccess: () => toast.success(`Plano "${plan.name}" desativado.`),
			onError: () => toast.error("Erro ao desativar plano."),
		});
	}

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Planos"
				description="Planos de assinatura disponíveis na plataforma."
				count={plans.length}
				countLabel="plano"
				icon={<Layers className="h-6 w-6" />}
			/>

			{isLoading ? (
				<Skeleton className="h-64 w-full" />
			) : plans.length === 0 ? (
				<p className="text-sm text-muted-foreground text-center py-12">
					Nenhum plano cadastrado.
				</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nome</TableHead>
							<TableHead>Slug</TableHead>
							<TableHead>Tier</TableHead>
							<TableHead>Período</TableHead>
							<TableHead>Preço</TableHead>
							<TableHead>Max Consultas</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{plans.map((plan) => (
							<TableRow key={plan.id}>
								<TableCell className="font-medium">{plan.name}</TableCell>
								<TableCell className="font-mono text-sm text-muted-foreground">
									{plan.slug}
								</TableCell>
								<TableCell>
									<Badge variant="secondary">{plan.tier}</Badge>
								</TableCell>
								<TableCell>
									{PERIOD_LABELS[plan.billingPeriod] ?? plan.billingPeriod}
								</TableCell>
								<TableCell>{formatBRL(plan.price)}</TableCell>
								<TableCell>
									{plan.maxAppointments != null
										? plan.maxAppointments
										: "Ilimitado"}
								</TableCell>
								<TableCell>
									<Badge
										variant={plan.status === "ACTIVE" ? "default" : "outline"}
										className="gap-1"
									>
										{plan.status === "ACTIVE" ? (
											<BadgeCheck className="h-3 w-3" />
										) : null}
										{plan.status === "ACTIVE" ? "Ativo" : "Inativo"}
									</Badge>
								</TableCell>
								<TableCell>
									{plan.status === "ACTIVE" && (
										<Button
											size="sm"
											variant="ghost"
											onClick={() => handleDeactivate(plan)}
											disabled={deactivate.isPending}
											className="text-destructive hover:text-destructive gap-1.5"
										>
											{deactivate.isPending ? (
												<Loader2 className="h-3.5 w-3.5 animate-spin" />
											) : (
												<PowerOff className="h-3.5 w-3.5" />
											)}
											Desativar
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
