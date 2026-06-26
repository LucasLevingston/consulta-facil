"use client";

import { FileText } from "lucide-react";
import { Suspense } from "react";
import { InvoiceTable } from "@/components/billing/InvoiceTable";
import PageHeader from "@/components/custom/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyInvoices } from "@/hooks/api/billing/use-invoices";

function UserInvoicesContent() {
	const { data: invoices = [], isLoading } = useMyInvoices();

	if (isLoading) return <Skeleton className="h-64 w-full" />;

	return <InvoiceTable invoices={invoices} />;
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
