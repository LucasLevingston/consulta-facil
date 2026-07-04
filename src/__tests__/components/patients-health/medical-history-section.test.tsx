import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Testes de MedicalHistorySection: campos de histórico médico e
// estado do botão de salvar.

vi.mock("@/components/ui/form", () => ({
	FormField: ({
		name,
		render,
	}: {
		name: string;
		render: (arg: { field: object }) => React.ReactNode;
	}) => <div>{render({ field: { value: "", onChange: vi.fn(), name } })}</div>,
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

vi.mock("@/components/ui/textarea", () => ({
	Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
		<textarea {...props} />
	),
}));

vi.mock("@/components/ui/button", () => ({
	Button: ({
		children,
		disabled,
		type,
	}: {
		children: React.ReactNode;
		disabled?: boolean;
		type?: "button" | "submit";
	}) => (
		<button type={type ?? "button"} disabled={disabled}>
			{children}
		</button>
	),
}));

import { MedicalHistorySection } from "@/components/patients/health/MedicalHistorySection";

describe("MedicalHistorySection", () => {
	it("renderiza os labels de todos os campos de histórico", () => {
		render(<MedicalHistorySection control={{} as never} isPending={false} />);
		expect(screen.getByText("Alergias")).toBeInTheDocument();
		expect(screen.getByText("Medicações atuais")).toBeInTheDocument();
		expect(screen.getByText("Histórico médico anterior")).toBeInTheDocument();
		expect(screen.getByText("Histórico médico familiar")).toBeInTheDocument();
	});

	it("renderiza o botão 'Salvar' quando isPending=false", () => {
		render(<MedicalHistorySection control={{} as never} isPending={false} />);
		expect(screen.getByText("Salvar")).toBeInTheDocument();
		expect(screen.getByText("Salvar")).not.toBeDisabled();
	});

	it("renderiza 'Salvando...' e desabilita o botão quando isPending=true", () => {
		render(<MedicalHistorySection control={{} as never} isPending={true} />);
		expect(screen.getByText("Salvando...")).toBeDisabled();
	});
});
