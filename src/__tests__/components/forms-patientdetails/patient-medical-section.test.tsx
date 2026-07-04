import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { PatientMedicalSection } from "@/components/forms/PatientDetails/PatientMedicalSection";

type MedicalValues = {
	allergies: string;
	currentMedication: string;
	familyMedicalHistory: string;
	pastMedicalHistory: string;
};

function Harness() {
	const form = useForm<MedicalValues>({
		defaultValues: {
			allergies: "",
			currentMedication: "",
			familyMedicalHistory: "",
			pastMedicalHistory: "",
		},
	});
	return (
		<FormProvider {...form}>
			<PatientMedicalSection form={form as never} />
			<span data-testid="allergies-value">{form.watch("allergies")}</span>
			<span data-testid="current-medication-value">
				{form.watch("currentMedication")}
			</span>
		</FormProvider>
	);
}

describe("PatientMedicalSection", () => {
	it("renderiza o título da seção de informações médicas", () => {
		render(<Harness />);
		expect(screen.getByText("Informações Médicas")).toBeInTheDocument();
	});

	it("renderiza os rótulos dos quatro campos de histórico médico", () => {
		render(<Harness />);
		expect(screen.getByText("Alergias (se houver)")).toBeInTheDocument();
		expect(screen.getByText("Medicações Atuais")).toBeInTheDocument();
		expect(
			screen.getByText("Histórico Médico Familiar (se relevante)"),
		).toBeInTheDocument();
		expect(screen.getByText("Histórico Médico Anterior")).toBeInTheDocument();
	});

	it("renderiza os placeholders esperados em cada textarea", () => {
		render(<Harness />);
		expect(
			screen.getByPlaceholderText("Amendoins, Penicilina, Polen"),
		).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText("Ibuprofeno 200mg, Levotiroxina 50mcg"),
		).toBeInTheDocument();
	});

	it("propaga o texto digitado em alergias para o form pai", async () => {
		const user = userEvent.setup();
		render(<Harness />);
		await user.type(
			screen.getByPlaceholderText("Amendoins, Penicilina, Polen"),
			"Penicilina",
		);
		expect(screen.getByTestId("allergies-value")).toHaveTextContent(
			"Penicilina",
		);
	});

	it("propaga o texto digitado em medicações atuais para o form pai", async () => {
		const user = userEvent.setup();
		render(<Harness />);
		await user.type(
			screen.getByPlaceholderText("Ibuprofeno 200mg, Levotiroxina 50mcg"),
			"Losartana",
		);
		expect(screen.getByTestId("current-medication-value")).toHaveTextContent(
			"Losartana",
		);
	});
});
