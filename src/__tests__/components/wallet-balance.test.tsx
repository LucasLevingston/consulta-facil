import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WalletBalance } from "@/components/wallet/WalletBalance";

describe("WalletBalance", () => {
	it("renders Disponivel label", () => {
		render(<WalletBalance balance={100} pendingBalance={50} />);
		expect(screen.getByText("Disponivel")).toBeInTheDocument();
	});

	it("renders Pendente label", () => {
		render(<WalletBalance balance={100} pendingBalance={50} />);
		expect(screen.getByText("Pendente")).toBeInTheDocument();
	});

	it("formats balance as BRL", () => {
		render(<WalletBalance balance={250} pendingBalance={0} />);
		expect(screen.getByText(/R\$.*250|250.*R\$/)).toBeInTheDocument();
	});
});
