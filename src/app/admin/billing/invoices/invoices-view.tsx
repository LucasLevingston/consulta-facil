"use client";

import { FileText } from "lucide-react";
import { InvoiceTable } from "@/components/billing/InvoiceTable";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { useAdminInvoices } from "@/features/billing";

function AdminBillingInvoicesContent() {
	const { data: invoices } = useAdminInvoices();

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Notas Fiscais"
				description="Notas fiscais geradas para cada pagamento pago."
				count={invoices.length}
				countLabel="nota"
				icon={<FileText className="h-6 w-6" />}
			/>
			<InvoiceTable invoices={invoices} />
		</div>
	);
}

export function AdminInvoicesView() {
	return (
		<SuspenseBoundary>
			<AdminBillingInvoicesContent />
		</SuspenseBoundary>
	);
}
