"use client";

import { InvoiceTable } from "@/components/billing/InvoiceTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminInvoices } from "@/hooks/api/billing/use-invoices";

export default function AdminBillingInvoicesPage() {
	const { data: invoices = [], isLoading } = useAdminInvoices();

	return (
		<div className="space-y-6 p-6">
			<div>
				<h1 className="text-2xl font-bold">Notas Fiscais</h1>
				<p className="text-muted-foreground">
					Notas fiscais geradas para cada pagamento pago.
				</p>
			</div>
			{isLoading ? (
				<Skeleton className="h-64 w-full" />
			) : (
				<InvoiceTable invoices={invoices} />
			)}
		</div>
	);
}
