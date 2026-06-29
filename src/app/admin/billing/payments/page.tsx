"use client";

import { CreditCard } from "lucide-react";
import { PaymentTable } from "@/components/billing/PaymentTable";
import PageHeader from "@/components/custom/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminBillingPayments } from "@/features/billing";

export default function AdminBillingPaymentsPage() {
	const { data: payments = [], isLoading } = useAdminBillingPayments();

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Pagamentos"
				description="Todos os pagamentos processados na plataforma."
				count={payments.length}
				countLabel="transação"
				icon={<CreditCard className="h-6 w-6" />}
			/>
			{isLoading ? (
				<Skeleton className="h-64 w-full" />
			) : (
				<PaymentTable payments={payments} />
			)}
		</div>
	);
}
