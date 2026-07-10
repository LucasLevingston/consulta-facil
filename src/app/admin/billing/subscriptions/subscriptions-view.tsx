"use client";

import { Users } from "lucide-react";
import { toast } from "sonner";
import { SubscriptionsTable } from "@/components/admin/SubscriptionsTable";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import type { AdminSubscriptionResponse } from "@/features/subscriptions";
import { useAdminCancelSubscription } from "./use-admin-cancel-subscription";
import { useAdminSubscriptions } from "./use-admin-subscriptions";

function AdminSubscriptionsContent() {
	const { data: subscriptions } = useAdminSubscriptions();
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
			{subscriptions.length === 0 ? (
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

export function AdminSubscriptionsView() {
	return (
		<SuspenseBoundary>
			<AdminSubscriptionsContent />
		</SuspenseBoundary>
	);
}
