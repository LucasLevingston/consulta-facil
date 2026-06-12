"use client";

import { Receipt } from "lucide-react";
import { Suspense } from "react";
import { PaymentTable } from "@/components/billing/PaymentTable";
import PageHeader from "@/components/custom/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyBillingPayments } from "@/hooks/api/billing/use-billing-payments";
import { useUserStore } from "@/store/useUserStore";

function PaymentHistoryContent() {
	const { user } = useUserStore();
	const { data: payments = [], isLoading } = useMyBillingPayments(
		user?.id ?? "",
	);

	if (isLoading) {
		return <Skeleton className="h-64 w-full" />;
	}

	return <PaymentTable payments={payments} />;
}

export default function PaymentHistoryPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Histórico de Pagamentos"
				description="Todos os seus pagamentos realizados na plataforma."
				icon={<Receipt className="h-6 w-6" />}
			/>
			<Suspense fallback={<Skeleton className="h-64 w-full" />}>
				<PaymentHistoryContent />
			</Suspense>
		</div>
	);
}
