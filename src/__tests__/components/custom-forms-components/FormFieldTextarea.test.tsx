import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Control, FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { FormFieldTextarea } from "@/components/custom/forms-components/FormFieldTextarea";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

type Values = { notes?: string };

function Harness({
	defaultValues,
	disabled,
}: {
	defaultValues?: Values;
	disabled?: boolean;
}) {
	const form = useForm<Values>({ defaultValues });
	return (
		<FormProvider {...form}>
			<FormField
				control={form.control as unknown as Control<FieldValues>}
				name="notes"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Observações</FormLabel>
						<FormFieldTextarea
							field={field}
							placeholder="Escreva aqui"
							disabled={disabled}
						/>
					</FormItem>
				)}
			/>
			<span data-testid="notes-value">{form.watch("notes")}</span>
		</FormProvider>
	);
}

describe("FormFieldTextarea", () => {
	it("renderiza o label Observações", () => {
		render(<Harness />);
		expect(screen.getByText("Observações")).toBeInTheDocument();
	});

	it("exibe o valor inicial vindo do form pai", () => {
		render(<Harness defaultValues={{ notes: "Paciente estável" }} />);
		expect(screen.getByPlaceholderText("Escreva aqui")).toHaveValue(
			"Paciente estável",
		);
	});

	it("propaga a digitação para o form pai", async () => {
		render(<Harness />);
		const textarea = screen.getByPlaceholderText("Escreva aqui");
		await userEvent.type(textarea, "Sem queixas");
		expect(screen.getByTestId("notes-value")).toHaveTextContent("Sem queixas");
	});

	it("desabilita o textarea quando disabled é true", () => {
		render(<Harness disabled />);
		expect(screen.getByPlaceholderText("Escreva aqui")).toBeDisabled();
	});

	it("NÃO associa o id do FormControl ao textarea — ele cai na div wrapper, não no textarea", () => {
		render(<Harness />);
		expect(() => screen.getByLabelText("Observações")).toThrow();
		expect(screen.getByPlaceholderText("Escreva aqui")).toBeInTheDocument();
	});
});
