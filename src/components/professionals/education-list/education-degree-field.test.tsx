import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/professionals", () => ({
	degreeTypeOptions: [
		{ value: "GRADUATION", label: "Graduação" },
		{ value: "SPECIALIZATION", label: "Especialização" },
		{ value: "MASTER", label: "Mestrado" },
		{ value: "PHD", label: "Doutorado" },
		{ value: "OTHER", label: "Outro" },
	],
}));
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
		<div data-testid="select" data-value={value}>
			<button type="button" onClick={() => onValueChange?.("MASTER")}>
				escolher-mestrado
			</button>
			{children}
		</div>
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

import userEvent from "@testing-library/user-event";
import { EducationDegreeField } from "./EducationDegreeField";

type Values = { degree?: string };

function Harness({ defaultValues }: { defaultValues?: Values }) {
	const form = useForm<Values>({ defaultValues });
	return (
		<FormProvider {...form}>
			<EducationDegreeField control={form.control as never} />
			<span data-testid="degree-value">{form.watch("degree")}</span>
		</FormProvider>
	);
}

describe("EducationDegreeField", () => {
	it("renderiza o label 'Grau'", () => {
		render(<Harness />);
		expect(screen.getByText("Grau")).toBeInTheDocument();
	});

	it("renderiza todas as opções de grau", () => {
		render(<Harness />);
		expect(screen.getByText("Graduação")).toBeInTheDocument();
		expect(screen.getByText("Especialização")).toBeInTheDocument();
		expect(screen.getByText("Mestrado")).toBeInTheDocument();
		expect(screen.getByText("Doutorado")).toBeInTheDocument();
		expect(screen.getByText("Outro")).toBeInTheDocument();
	});

	it("passa o valor inicial do form pai para o Select", () => {
		render(<Harness defaultValues={{ degree: "PHD" }} />);
		expect(screen.getByTestId("select")).toHaveAttribute("data-value", "PHD");
	});

	it("propaga a seleção de opção para o form pai", async () => {
		render(<Harness />);
		await userEvent.click(screen.getByText("escolher-mestrado"));
		expect(screen.getByTestId("degree-value")).toHaveTextContent("MASTER");
	});
});
