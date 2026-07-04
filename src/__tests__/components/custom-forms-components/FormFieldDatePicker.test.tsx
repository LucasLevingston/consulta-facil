import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Control, FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { FormFieldDatePicker } from "@/components/custom/forms-components/FormFieldDatePicker";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

type Values = { birthDate?: string };

function Harness({ defaultValues }: { defaultValues?: Values }) {
	const form = useForm<Values>({ defaultValues });
	return (
		<FormProvider {...form}>
			<FormField
				control={form.control as unknown as Control<FieldValues>}
				name="birthDate"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Data de nascimento</FormLabel>
						<FormFieldDatePicker
							field={field}
							placeholder="Selecione uma data"
						/>
					</FormItem>
				)}
			/>
			<span data-testid="birth-date-value">
				{String(form.watch("birthDate") ?? "")}
			</span>
		</FormProvider>
	);
}

describe("FormFieldDatePicker", () => {
	it("renderiza o label Data de nascimento", () => {
		render(<Harness />);
		expect(screen.getByText("Data de nascimento")).toBeInTheDocument();
	});

	it("mostra o placeholder quando não há data selecionada", () => {
		render(<Harness />);
		expect(screen.getByText("Selecione uma data")).toBeInTheDocument();
	});

	it("mostra a data formatada quando já existe um valor inicial", () => {
		render(<Harness defaultValues={{ birthDate: "2026-08-10T12:00:00" }} />);
		expect(screen.getByText("10/08/2026")).toBeInTheDocument();
	});

	it("abre o calendário, seleciona um dia e propaga o valor para o form pai", async () => {
		const user = userEvent.setup();
		render(<Harness />);

		await user.click(
			screen.getByRole("button", { name: /Selecione uma data/ }),
		);

		const dayButtons = screen
			.getAllByRole("gridcell")
			.map((cell) => cell.querySelector("button"))
			.filter((btn): btn is HTMLButtonElement => !!btn && !btn.disabled);
		expect(dayButtons.length).toBeGreaterThan(0);

		await user.click(dayButtons[0]);

		expect(screen.getByTestId("birth-date-value").textContent).not.toBe("");
	});
});
