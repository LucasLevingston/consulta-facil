"use client";

import { FileText } from "lucide-react";
import { InvoiceTable } from "@/components/billing/InvoiceTable";
import PageHeader from "@/components/custom/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminInvoices } from "@/hooks/api/billing/use-invoices";

export default function AdminBillingInvoicesPage() {
	const { data: invoices = [], isLoading } = useAdminInvoices();

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Notas Fiscais"
				description="Notas fiscais geradas para cada pagamento pago."
				count={invoices.length}
				countLabel="nota"
				icon={<FileText className="h-6 w-6" />}
			/>
			{isLoading ? (
				<Skeleton className="h-64 w-full" />
			) : (
				<InvoiceTable invoices={invoices} />
			)}
		</div>
	);
}
