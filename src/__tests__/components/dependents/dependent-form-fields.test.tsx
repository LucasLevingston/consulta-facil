import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/form", () => ({
	FormField: ({
		name,
		render,
	}: {
		name: string;
		render: (arg: { field: object }) => React.ReactNode;
	}) => render({ field: { value: "", onChange: vi.fn(), name } }),
	FormItem: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	FormLabel: ({ children }: { children: React.ReactNode }) => (
		<span>{children}</span>
	),
	FormControl: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	FormMessage: () => null,
}));
vi.mock("@/components/ui/input", () => ({
	Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
		<input {...props} />
	),
}));
vi.mock("@/components/ui/select", () => ({
	Select: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectValue: ({ placeholder }: { placeholder?: string }) => (
		<span>{placeholder}</span>
	),
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

import { DependentFormFields } from "@/components/dependents/DependentFormFields";

describe("DependentFormFields", () => {
	it("renderiza o campo de nome obrigatório", () => {
		render(<DependentFormFields control={{} as never} />);
		expect(screen.getByText("Nome *")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Nome completo")).toBeInTheDocument();
	});

	it("renderiza o campo de relação (RelationshipField)", () => {
		render(<DependentFormFields control={{} as never} />);
		expect(screen.getByText("Relação *")).toBeInTheDocument();
		expect(screen.getByText("Filho(a)")).toBeInTheDocument();
	});

	it("renderiza o campo de CPF opcional", () => {
		render(<DependentFormFields control={{} as never} />);
		expect(screen.getByText("CPF (opcional)")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("000.000.000-00")).toBeInTheDocument();
	});

	it("renderiza o campo de data de nascimento opcional", () => {
		render(<DependentFormFields control={{} as never} />);
		expect(
			screen.getByText("Data de nascimento (opcional)"),
		).toBeInTheDocument();
	});

	it("renderiza o campo de gênero opcional com todas as opções", () => {
		render(<DependentFormFields control={{} as never} />);
		expect(screen.getByText("Gênero (opcional)")).toBeInTheDocument();
		expect(screen.getByText("Masculino")).toBeInTheDocument();
		expect(screen.getByText("Feminino")).toBeInTheDocument();
	});
});
