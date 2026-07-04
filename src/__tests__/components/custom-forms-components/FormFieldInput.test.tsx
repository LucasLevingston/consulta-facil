import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Control, FieldValues, Path } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { FormFieldInput } from "@/components/custom/forms-components/FormFieldInput";
import { FormFieldType } from "@/components/custom/forms-components/form-field-type";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

type Values = {
	name?: string;
	email?: string;
};

function Harness<K extends Path<Values>>({
	name,
	fieldType,
	defaultValues,
	disabled,
}: {
	name: K;
	fieldType: FormFieldType;
	defaultValues?: Values;
	disabled?: boolean;
}) {
	const form = useForm<Values>({ defaultValues });
	return (
		<FormProvider {...form}>
			<FormField
				control={form.control as unknown as Control<FieldValues>}
				name={name}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Nome do campo</FormLabel>
						<FormFieldInput
							field={field}
							fieldType={fieldType}
							placeholder="Digite aqui"
							disabled={disabled}
						/>
					</FormItem>
				)}
			/>
			<span data-testid="field-value">{form.watch(name)}</span>
		</FormProvider>
	);
}

describe("FormFieldInput", () => {
	it("renderiza o label associado ao campo", () => {
		render(<Harness name="name" fieldType={FormFieldType.INPUT} />);
		expect(screen.getByText("Nome do campo")).toBeInTheDocument();
	});

	it("renderiza um input do tipo text por padrão", () => {
		render(<Harness name="name" fieldType={FormFieldType.INPUT} />);
		const input = screen.getByPlaceholderText("Digite aqui");
		expect(input).toHaveAttribute("type", "text");
	});

	it("renderiza um input do tipo email quando fieldType é EMAIL", () => {
		render(<Harness name="email" fieldType={FormFieldType.EMAIL} />);
		const input = screen.getByPlaceholderText("Digite aqui");
		expect(input).toHaveAttribute("type", "email");
	});

	it("exibe o valor inicial vindo do form pai", () => {
		render(
			<Harness
				name="name"
				fieldType={FormFieldType.INPUT}
				defaultValues={{ name: "Maria" }}
			/>,
		);
		expect(screen.getByPlaceholderText("Digite aqui")).toHaveValue("Maria");
	});

	it("propaga a digitação para o form pai", async () => {
		render(<Harness name="name" fieldType={FormFieldType.INPUT} />);
		const input = screen.getByPlaceholderText("Digite aqui");
		await userEvent.type(input, "João");
		expect(screen.getByTestId("field-value")).toHaveTextContent("João");
	});

	it("desabilita o input quando disabled é true", () => {
		render(<Harness name="name" fieldType={FormFieldType.INPUT} disabled />);
		expect(screen.getByPlaceholderText("Digite aqui")).toBeDisabled();
	});

	it("associa o id do FormControl diretamente ao input (label aponta pro campo certo)", () => {
		render(<Harness name="name" fieldType={FormFieldType.INPUT} />);
		expect(screen.getByLabelText("Nome do campo")).toBe(
			screen.getByPlaceholderText("Digite aqui"),
		);
	});
});
