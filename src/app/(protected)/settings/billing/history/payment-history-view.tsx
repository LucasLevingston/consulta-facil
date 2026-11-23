"use client";

import { Receipt } from "lucide-react";
import { PaymentTable } from "@/components/billing/PaymentTable";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { useUserStore } from "@/features/auth";
import { useMyBillingPayments } from "./use-my-billing-payments";

function PaymentHistoryContent() {
	const { user } = useUserStore();
	const { data: payments = [] } = useMyBillingPayments(user?.id ?? "");

	return <PaymentTable payments={payments} />;
}

export function PaymentHistoryView() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Histórico de Pagamentos"
				description="Todos os seus pagamentos realizados na plataforma."
				icon={<Receipt className="h-6 w-6" />}
			/>
			<SuspenseBoundary>
				<PaymentHistoryContent />
			</SuspenseBoundary>
		</div>
	);
}
