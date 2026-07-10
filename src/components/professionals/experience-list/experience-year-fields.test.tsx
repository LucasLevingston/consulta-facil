import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/professionals", () => ({}));

import { ExperienceYearFields } from "./ExperienceYearFields";

type Values = { startYear?: number; endYear?: number | null };

function Harness({ defaultValues }: { defaultValues?: Values }) {
	const form = useForm<Values>({ defaultValues });
	return (
		<FormProvider {...form}>
			<ExperienceYearFields control={form.control as never} />
			<span data-testid="start-value">{String(form.watch("startYear"))}</span>
			<span data-testid="end-value">{String(form.watch("endYear"))}</span>
		</FormProvider>
	);
}

describe("ExperienceYearFields", () => {
	it("renderiza os labels 'Ano início' e 'Ano fim'", () => {
		render(<Harness />);
		expect(screen.getByText("Ano início")).toBeInTheDocument();
		expect(
			screen.getByText("Ano fim (deixe vazio se atual)"),
		).toBeInTheDocument();
	});

	it("exibe os valores iniciais vindos do form pai", () => {
		render(<Harness defaultValues={{ startYear: 2015, endYear: 2020 }} />);
		expect(screen.getByPlaceholderText("2015")).toHaveValue(2015);
		expect(screen.getByPlaceholderText("2020")).toHaveValue(2020);
	});

	it("propaga a digitação do ano início como número para o form pai", async () => {
		render(<Harness />);
		const input = screen.getByPlaceholderText("2015");
		await userEvent.type(input, "2018");
		expect(screen.getByTestId("start-value")).toHaveTextContent("2018");
	});

	it("propaga a digitação do ano fim como número para o form pai", async () => {
		render(<Harness />);
		const input = screen.getByPlaceholderText("2020");
		await userEvent.type(input, "2022");
		expect(screen.getByTestId("end-value")).toHaveTextContent("2022");
	});

	it("define endYear como null quando o campo é limpo", async () => {
		render(<Harness defaultValues={{ endYear: 2020 }} />);
		const input = screen.getByPlaceholderText("2020");
		await userEvent.clear(input);
		expect(screen.getByTestId("end-value")).toHaveTextContent("null");
	});
});
