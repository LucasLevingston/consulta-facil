import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		value,
		onValueChange,
	}: {
		children: React.ReactNode;
		value?: string;
		onValueChange: (v: string) => void;
	}) => (
		<div data-testid="select" data-value={value}>
			{children}
			<button
				type="button"
				data-testid="pick-rg"
				onClick={() => onValueChange("RG")}
			>
				selecionar-rg
			</button>
		</div>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectValue: () => null,
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <div data-value={value}>{children}</div>,
}));

vi.mock("@/features/patients", () => ({
	DOCUMENT_TYPE_LABELS: {
		CPF: "CPF",
		RG: "RG",
		CNH: "CNH",
		HEALTH_CARD: "Cartão de Saúde",
		INSURANCE_CARD: "Carteirinha do Plano",
		OTHER: "Outro",
	},
	documentTypeSchema: { parse: (v: string) => v },
}));

import { DocumentTypeSelect } from "./DocumentTypeSelect";

describe("DocumentTypeSelect", () => {
	it("renderiza todas as opções de tipo de documento", () => {
		render(<DocumentTypeSelect value={"OTHER" as never} onChange={vi.fn()} />);
		expect(screen.getByText("CPF")).toBeInTheDocument();
		expect(screen.getByText("RG")).toBeInTheDocument();
		expect(screen.getByText("CNH")).toBeInTheDocument();
		expect(screen.getByText("Cartão de Saúde")).toBeInTheDocument();
		expect(screen.getByText("Carteirinha do Plano")).toBeInTheDocument();
		expect(screen.getByText("Outro")).toBeInTheDocument();
	});

	it("passa o value recebido para o Select", () => {
		render(<DocumentTypeSelect value={"CNH" as never} onChange={vi.fn()} />);
		expect(screen.getByTestId("select")).toHaveAttribute("data-value", "CNH");
	});

	it("chama onChange com o valor validado pelo schema ao selecionar", async () => {
		const onChange = vi.fn();
		render(<DocumentTypeSelect value={"OTHER" as never} onChange={onChange} />);
		await userEvent.click(screen.getByTestId("pick-rg"));
		expect(onChange).toHaveBeenCalledWith("RG");
	});
});
