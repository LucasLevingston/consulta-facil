"use client";

import { CreditCard } from "lucide-react";
import { PaymentTable } from "@/components/billing/PaymentTable";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { useAdminBillingPayments } from "./use-admin-billing-payments";

function AdminBillingPaymentsContent() {
	const { data: payments } = useAdminBillingPayments();

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Pagamentos"
				description="Todos os pagamentos processados na plataforma."
				count={payments.length}
				countLabel="transação"
				icon={<CreditCard className="h-6 w-6" />}
			/>
			<PaymentTable payments={payments} />
		</div>
	);
}

export function BillingPaymentsView() {
	return (
		<SuspenseBoundary>
			<AdminBillingPaymentsContent />
		</SuspenseBoundary>
	);
}
