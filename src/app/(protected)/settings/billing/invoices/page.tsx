"use client";

import { FileText } from "lucide-react";
import { Suspense } from "react";
import { InvoiceTable } from "@/components/billing/InvoiceTable";
import PageHeader from "@/components/custom/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyBillingPayments } from "@/hooks/api/billing/use-billing-payments";
import { useUserStore } from "@/store/useUserStore";

function UserInvoicesContent() {
	const { user } = useUserStore();
	const { data: payments = [], isLoading } = useMyBillingPayments(
		user?.id ?? "",
	);

	if (isLoading) return <Skeleton className="h-64 w-full" />;

	if (payments.filter((p) => p.status === "PAID").length === 0) {
		return (
			<p className="text-center text-muted-foreground py-8">
				Nenhuma nota fiscal disponível.
			</p>
		);
	}

	return <InvoiceTable invoices={[]} />;
}

export default function UserInvoicesPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Notas Fiscais"
				description="Notas fiscais dos pagamentos realizados."
				icon={<FileText className="h-6 w-6" />}
			/>
			<Suspense fallback={<Skeleton className="h-64 w-full" />}>
				<UserInvoicesContent />
			</Suspense>
		</div>
	);
}
