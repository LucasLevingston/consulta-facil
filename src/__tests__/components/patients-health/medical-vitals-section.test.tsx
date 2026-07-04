import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Testes de MedicalVitalsSection: campos de altura/peso e exibição
// condicional do IMC calculado.

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

vi.mock("@/components/ui/input", () => ({
	Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
		<input {...props} />
	),
}));

vi.mock("@/components/patients/health/BloodTypeSelect", () => ({
	BloodTypeSelect: () => <div data-testid="blood-type-select" />,
}));

import { MedicalVitalsSection } from "@/components/patients/health/MedicalVitalsSection";

describe("MedicalVitalsSection", () => {
	it("renderiza o BloodTypeSelect", () => {
		render(<MedicalVitalsSection control={{} as never} bmi={null} />);
		expect(screen.getByTestId("blood-type-select")).toBeInTheDocument();
	});

	it("renderiza os labels de altura e peso", () => {
		render(<MedicalVitalsSection control={{} as never} bmi={null} />);
		expect(screen.getByText("Altura (m)")).toBeInTheDocument();
		expect(screen.getByText("Peso (kg)")).toBeInTheDocument();
	});

	it("não exibe o IMC quando bmi é null", () => {
		render(<MedicalVitalsSection control={{} as never} bmi={null} />);
		expect(screen.queryByText(/IMC:/)).not.toBeInTheDocument();
	});

	it("exibe o IMC e a classificação quando bmi é informado", () => {
		render(<MedicalVitalsSection control={{} as never} bmi={24.5} />);
		expect(screen.getByText(/IMC: 24.5/)).toBeInTheDocument();
		expect(screen.getByText("(Normal)")).toBeInTheDocument();
	});

	it("exibe a classificação 'Sobrepeso' para bmi acima de 25", () => {
		render(<MedicalVitalsSection control={{} as never} bmi={27} />);
		expect(screen.getByText("(Sobrepeso)")).toBeInTheDocument();
	});
});
