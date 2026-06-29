"use client";

import { Ban, Loader2, Users } from "lucide-react";
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
import type { AdminSubscriptionResponse } from "@/features/subscriptions";
import {
	useAdminCancelSubscription,
	useAdminSubscriptions,
} from "@/features/subscriptions";

const STATUS_CONFIG: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
	}
> = {
	ACTIVE: { label: "Ativa", variant: "default" },
	PENDING: { label: "Pendente", variant: "secondary" },
	CANCELLED: { label: "Cancelada", variant: "destructive" },
	EXPIRED: { label: "Expirada", variant: "outline" },
};

const OWNER_LABELS: Record<string, string> = {
	DOCTOR: "Médico",
	CLINIC: "Clínica",
	LABORATORY: "Laboratório",
};

export default function AdminSubscriptionsPage() {
	const { data: subscriptions = [], isLoading } = useAdminSubscriptions();
	const cancel = useAdminCancelSubscription();

	function handleCancel(sub: AdminSubscriptionResponse) {
		cancel.mutate(sub.id, {
			onSuccess: () =>
				toast.success(`Assinatura de ${sub.userEmail} cancelada.`),
			onError: () => toast.error("Erro ao cancelar assinatura."),
		});
	}

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Assinaturas"
				description="Todas as assinaturas ativas na plataforma."
				count={subscriptions.length}
				countLabel="assinatura"
				icon={<Users className="h-6 w-6" />}
			/>

			{isLoading ? (
				<Skeleton className="h-64 w-full" />
			) : subscriptions.length === 0 ? (
				<p className="text-sm text-muted-foreground text-center py-12">
					Nenhuma assinatura encontrada.
				</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Usuário</TableHead>
							<TableHead>Plano</TableHead>
							<TableHead>Tipo</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Expira em</TableHead>
							<TableHead>Criado em</TableHead>
							<TableHead>Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{subscriptions.map((sub) => {
							const cfg = STATUS_CONFIG[sub.status] ?? {
								label: sub.status,
								variant: "outline" as const,
							};
							return (
								<TableRow key={sub.id}>
									<TableCell>
										<p className="font-medium text-sm">{sub.userEmail}</p>
									</TableCell>
									<TableCell>{sub.planName}</TableCell>
									<TableCell>
										{OWNER_LABELS[sub.ownerType] ?? sub.ownerType}
									</TableCell>
									<TableCell>
										<Badge variant={cfg.variant}>{cfg.label}</Badge>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{sub.expiresAt
											? new Date(sub.expiresAt).toLocaleDateString("pt-BR")
											: "—"}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{new Date(sub.createdAt).toLocaleDateString("pt-BR")}
									</TableCell>
									<TableCell>
										{sub.status === "ACTIVE" && (
											<Button
												size="sm"
												variant="ghost"
												onClick={() => handleCancel(sub)}
												disabled={cancel.isPending}
												className="text-destructive hover:text-destructive gap-1.5"
											>
												{cancel.isPending ? (
													<Loader2 className="h-3.5 w-3.5 animate-spin" />
												) : (
													<Ban className="h-3.5 w-3.5" />
												)}
												Cancelar
											</Button>
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
