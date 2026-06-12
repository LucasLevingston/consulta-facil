"use client";

import { PaymentTable } from "@/components/billing/PaymentTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminBillingPayments } from "@/hooks/api/billing/use-billing-payments";

export default function AdminBillingPaymentsPage() {
	const { data: payments = [], isLoading } = useAdminBillingPayments();

	return (
		<div className="space-y-6 p-6">
			<div>
				<h1 className="text-2xl font-bold">Pagamentos</h1>
				<p className="text-muted-foreground">
					Todos os pagamentos processados na plataforma.
				</p>
			</div>
			{isLoading ? (
				<Skeleton className="h-64 w-full" />
			) : (
				<PaymentTable payments={payments} />
			)}
		</div>
	);
}
