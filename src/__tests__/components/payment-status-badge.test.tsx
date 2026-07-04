import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PaymentStatusBadge } from "@/components/billing/PaymentStatusBadge";

describe("PaymentStatusBadge", () => {
	it("PENDING → Pendente", () => {
		render(<PaymentStatusBadge status="PENDING" />);
		expect(screen.getByText("Pendente")).toBeInTheDocument();
	});

	it("PAID → Pago", () => {
		render(<PaymentStatusBadge status="PAID" />);
		expect(screen.getByText("Pago")).toBeInTheDocument();
	});

	it("FAILED → Falhou", () => {
		render(<PaymentStatusBadge status="FAILED" />);
		expect(screen.getByText("Falhou")).toBeInTheDocument();
	});

	it("REFUNDED → Reembolsado", () => {
		render(<PaymentStatusBadge status="REFUNDED" />);
		expect(screen.getByText("Reembolsado")).toBeInTheDocument();
	});

	it("CANCELED → Cancelado", () => {
		render(<PaymentStatusBadge status="CANCELED" />);
		expect(screen.getByText("Cancelado")).toBeInTheDocument();
	});
});
