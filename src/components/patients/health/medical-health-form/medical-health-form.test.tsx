import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Testes de MedicalHealthForm: renderização usando o hook
// useMedicalHealthForm mockado (já testado isoladamente em
// use-medical-health-form.test.ts).

const { formState } = vi.hoisted(() => ({
	formState: {
		bmi: null as number | null,
		isPending: false,
	},
}));

vi.mock("@/features/patients/hooks/use-medical-health-form", () => ({
	useMedicalHealthForm: () => ({
		form: {
			control: {},
			handleSubmit: (fn: (data: object) => void) => (e: React.FormEvent) => {
				e.preventDefault();
				fn({});
			},
		},
		bmi: formState.bmi,
		isPending: formState.isPending,
		onSubmit: vi.fn(),
	}),
}));

vi.mock("@/components/ui/form", () => ({
	Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("./MedicalVitalsSection", () => ({
	MedicalVitalsSection: ({ bmi }: { bmi: number | null }) => (
		<div data-testid="vitals-section">bmi:{bmi ?? "null"}</div>
	),
}));

vi.mock("./MedicalHistorySection", () => ({
	MedicalHistorySection: ({ isPending }: { isPending: boolean }) => (
		<div data-testid="history-section">pending:{String(isPending)}</div>
	),
}));

import { MedicalHealthForm } from "./MedicalHealthForm";

beforeEach(() => {
	formState.bmi = null;
	formState.isPending = false;
});

describe("MedicalHealthForm", () => {
	it("renderiza o título 'Dados de saúde'", () => {
		render(<MedicalHealthForm userId="u-1" />);
		expect(screen.getByText("Dados de saúde")).toBeInTheDocument();
	});

	it("renderiza a descrição do card", () => {
		render(<MedicalHealthForm userId="u-1" />);
		expect(
			screen.getByText("Tipo sanguíneo, altura, peso e histórico médico."),
		).toBeInTheDocument();
	});

	it("renderiza MedicalVitalsSection com o bmi do hook", () => {
		formState.bmi = 24.5;
		render(<MedicalHealthForm userId="u-1" />);
		expect(screen.getByTestId("vitals-section")).toHaveTextContent("bmi:24.5");
	});

	it("renderiza MedicalHistorySection com o isPending do hook", () => {
		formState.isPending = true;
		render(<MedicalHealthForm userId="u-1" />);
		expect(screen.getByTestId("history-section")).toHaveTextContent(
			"pending:true",
		);
	});
});
