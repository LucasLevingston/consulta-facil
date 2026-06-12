export interface InvoiceResponse {
	id: string;
	paymentId: string;
	invoiceNumber: string;
	pdfUrl: string | null;
	hostedUrl: string | null;
	createdAt: string;
}
