import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InvoiceTable } from "@/components/billing/InvoiceTable";
import type { InvoiceResponse } from "@/features/billing";

function buildInvoice(
	overrides: Partial<InvoiceResponse> = {},
): InvoiceResponse {
	return {
		id: "invoice-1",
		invoiceNumber: "NF-0001",
		paymentId: "payment-1",
		createdAt: "2026-02-10T00:00:00.000Z",
		hostedUrl: "https://invoices.example.com/nf-0001",
		...overrides,
	} as InvoiceResponse;
}

describe("InvoiceTable", () => {
	it("exibe mensagem de lista vazia quando nao ha notas fiscais", () => {
		render(<InvoiceTable invoices={[]} />);
		expect(
			screen.getByText("Nenhuma nota fiscal encontrada."),
		).toBeInTheDocument();
	});

	it("renderiza uma linha para cada nota fiscal da lista", () => {
		const invoices = [buildInvoice({ id: "i1" }), buildInvoice({ id: "i2" })];
		render(<InvoiceTable invoices={invoices} />);
		expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 linhas
	});

	it("exibe o numero da nota fiscal", () => {
		render(
			<InvoiceTable invoices={[buildInvoice({ invoiceNumber: "NF-9999" })]} />,
		);
		expect(screen.getByText("NF-9999")).toBeInTheDocument();
	});

	it("exibe o id do pagamento associado", () => {
		render(
			<InvoiceTable invoices={[buildInvoice({ paymentId: "payment-abc" })]} />,
		);
		expect(screen.getByText("payment-abc")).toBeInTheDocument();
	});

	it("formata a data de criacao no padrao pt-BR", () => {
		render(
			<InvoiceTable
				invoices={[buildInvoice({ createdAt: "2026-05-01T00:00:00.000Z" })]}
			/>,
		);
		expect(
			screen.getByText(
				new Date("2026-05-01T00:00:00.000Z").toLocaleDateString("pt-BR"),
			),
		).toBeInTheDocument();
	});

	it("renderiza o link Ver quando hostedUrl esta presente", () => {
		render(
			<InvoiceTable
				invoices={[buildInvoice({ hostedUrl: "https://example.com/nf" })]}
			/>,
		);
		const link = screen.getByRole("link", { name: /Ver/ });
		expect(link).toHaveAttribute("href", "https://example.com/nf");
	});

	it("nao renderiza o link Ver quando hostedUrl esta ausente", () => {
		render(
			<InvoiceTable invoices={[buildInvoice({ hostedUrl: undefined })]} />,
		);
		expect(screen.queryByRole("link", { name: /Ver/ })).not.toBeInTheDocument();
	});
});
