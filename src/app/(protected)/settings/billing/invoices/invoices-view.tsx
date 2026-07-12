"use client";

import { FileText } from "lucide-react";
import { InvoiceTable } from "@/components/billing/InvoiceTable";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { useMyInvoices } from "./use-my-invoices";

function UserInvoicesContent() {
	const { data: invoices } = useMyInvoices();

	return <InvoiceTable invoices={invoices} />;
}

export function UserInvoicesView() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Notas Fiscais"
				description="Notas fiscais dos pagamentos realizados."
				icon={<FileText className="h-6 w-6" />}
			/>
			<SuspenseBoundary>
				<UserInvoicesContent />
			</SuspenseBoundary>
		</div>
	);
}
