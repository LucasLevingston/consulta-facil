import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockGet = vi.fn();

vi.mock("next/navigation", () => ({
	useSearchParams: () => ({ get: mockGet }),
}));

import { BillingSuccessContent } from "@/components/billing/BillingSuccessContent";

describe("BillingSuccessContent", () => {
	it("renderiza o titulo de pagamento confirmado", () => {
		mockGet.mockReturnValue("");
		render(<BillingSuccessContent />);
		expect(screen.getByText("Pagamento confirmado!")).toBeInTheDocument();
	});

	it("exibe o plano Pro Mensal quando planId é monthly", () => {
		mockGet.mockReturnValue("monthly");
		render(<BillingSuccessContent />);
		expect(screen.getByText("Pro Mensal")).toBeInTheDocument();
	});

	it("exibe o plano Pro Anual quando planId é yearly", () => {
		mockGet.mockReturnValue("yearly");
		render(<BillingSuccessContent />);
		expect(screen.getByText("Pro Anual")).toBeInTheDocument();
	});

	it("exibe o plano padrao Pro quando planId é desconhecido", () => {
		mockGet.mockReturnValue("desconhecido");
		render(<BillingSuccessContent />);
		expect(screen.getByText("Pro")).toBeInTheDocument();
	});

	it("renderiza o link para o dashboard", () => {
		mockGet.mockReturnValue("");
		render(<BillingSuccessContent />);
		const link = screen.getByRole("link", { name: "Ir para o dashboard" });
		expect(link).toHaveAttribute("href", "/dashboard");
	});
});
