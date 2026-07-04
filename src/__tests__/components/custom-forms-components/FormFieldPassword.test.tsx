import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Control, FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { FormFieldPassword } from "@/components/custom/forms-components/FormFieldPassword";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

type Values = { password?: string };

function Harness({ defaultValues }: { defaultValues?: Values }) {
	const form = useForm<Values>({ defaultValues });
	return (
		<FormProvider {...form}>
			<FormField
				control={form.control as unknown as Control<FieldValues>}
				name="password"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Senha</FormLabel>
						<FormFieldPassword field={field} placeholder="Sua senha" />
					</FormItem>
				)}
			/>
			<span data-testid="password-value">{form.watch("password")}</span>
		</FormProvider>
	);
}

describe("FormFieldPassword", () => {
	it("renderiza o label Senha", () => {
		render(<Harness />);
		expect(screen.getByText("Senha")).toBeInTheDocument();
	});

	it("renderiza o input como type=password por padrão", () => {
		render(<Harness />);
		const input = screen.getByPlaceholderText("Sua senha");
		expect(input).toHaveAttribute("type", "password");
	});

	it("propaga a digitação da senha para o form pai", async () => {
		render(<Harness />);
		const input = screen.getByPlaceholderText("Sua senha");
		await userEvent.type(input, "segredo123");
		expect(screen.getByTestId("password-value")).toHaveTextContent(
			"segredo123",
		);
	});

	it("alterna para type=text ao clicar no botão de mostrar senha", async () => {
		render(<Harness />);
		const input = screen.getByPlaceholderText("Sua senha");
		expect(input).toHaveAttribute("type", "password");

		const toggleButton = screen.getByRole("button");
		await userEvent.click(toggleButton);

		expect(input).toHaveAttribute("type", "text");
	});

	it("alterna de volta para type=password ao clicar novamente no botão", async () => {
		render(<Harness />);
		const toggleButton = screen.getByRole("button");
		const input = screen.getByPlaceholderText("Sua senha");

		await userEvent.click(toggleButton);
		expect(input).toHaveAttribute("type", "text");

		await userEvent.click(toggleButton);
		expect(input).toHaveAttribute("type", "password");
	});

	it("NÃO associa o id do FormControl ao input — ele cai na div wrapper, não no input", () => {
		// Detalhe conhecido do componente: FormControl usa Slot e clona o id no
		// filho imediato (a <div className="relative">), mas o input real fica
		// aninhado dentro do wrapper do CustomInput, dois níveis abaixo — não
		// recebe o id diretamente.
		render(<Harness />);
		const input = screen.getByPlaceholderText("Sua senha");

		expect(input).not.toHaveAttribute("id");

		// Por consequência, getByLabelText não encontra o input (o htmlFor do
		// label aponta para um id que não está no input).
		expect(screen.queryByLabelText("Senha")).not.toBe(input);
	});
});
