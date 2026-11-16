import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Native <select> stand-in for the Radix select so value/onValueChange can be exercised in jsdom.
vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		value,
		onValueChange,
	}: {
		children: React.ReactNode;
		value?: string;
		onValueChange?: (v: string) => void;
	}) => (
		<select
			aria-label="modalidade"
			value={value ?? ""}
			onChange={(e) => onValueChange?.(e.target.value)}
		>
			{children}
		</select>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
	SelectValue: ({ placeholder }: { placeholder?: string }) => (
		<option value="">{placeholder}</option>
	),
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <option value={value}>{children}</option>,
}));

import { ProcedureModalitySelect } from "./ProcedureModalitySelect";

describe("ProcedureModalitySelect", () => {
	it("renderiza as opções Presencial e Online", () => {
		render(<ProcedureModalitySelect onChange={vi.fn()} />);
		expect(screen.getByRole("option", { name: "Presencial" })).toHaveValue(
			"IN_PERSON",
		);
		expect(screen.getByRole("option", { name: "Online" })).toHaveValue(
			"ONLINE",
		);
	});

	it("mostra o placeholder quando nada foi escolhido", () => {
		render(<ProcedureModalitySelect onChange={vi.fn()} />);
		expect(screen.getByRole("combobox")).toHaveValue("");
		expect(screen.getByText("Selecione (opcional)")).toBeInTheDocument();
	});

	it("chama onChange com o valor selecionado", async () => {
		const onChange = vi.fn();
		render(<ProcedureModalitySelect onChange={onChange} />);
		await userEvent.selectOptions(screen.getByRole("combobox"), "ONLINE");
		expect(onChange).toHaveBeenCalledWith("ONLINE");
	});

	it("reflete o valor selecionado no select", () => {
		render(<ProcedureModalitySelect value="IN_PERSON" onChange={vi.fn()} />);
		expect(screen.getByRole("combobox")).toHaveValue("IN_PERSON");
	});
});
