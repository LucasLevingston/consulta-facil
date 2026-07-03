"use client";

import { Users } from "lucide-react";
import { toast } from "sonner";
import { SubscriptionsTable } from "@/components/admin/SubscriptionsTable";
import PageHeader from "@/components/custom/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminSubscriptionResponse } from "@/features/subscriptions";
import {
	useAdminCancelSubscription,
	useAdminSubscriptions,
} from "@/features/subscriptions";

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
				<SubscriptionsTable
					subscriptions={subscriptions}
					onCancel={handleCancel}
					cancelPending={cancel.isPending}
				/>
			)}
		</div>
	);
}
