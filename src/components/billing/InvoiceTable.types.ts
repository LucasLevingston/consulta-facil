import type { InvoiceResponse } from "@/lib/schemas/billing/invoice.schema";

export interface InvoiceTableProps {
	invoices: InvoiceResponse[];
}
