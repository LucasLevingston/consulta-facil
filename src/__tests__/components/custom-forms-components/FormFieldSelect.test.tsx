import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Control, FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		value,
		disabled,
		onValueChange,
	}: {
		children: React.ReactNode;
		value?: string;
		disabled?: boolean;
		onValueChange?: (v: string) => void;
	}) => (
		<div data-testid="select" data-value={value} data-disabled={disabled}>
			<button type="button" onClick={() => onValueChange?.("SP")}>
				escolher-sp
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
	SelectGroup: ({ children }: { children: React.ReactNode }) => (
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

import { FormFieldSelect } from "@/components/custom/forms-components/FormFieldSelect";

type Values = { state?: string };

const options = [
	{ value: "SP", label: "São Paulo" },
	{ value: "RJ", label: "Rio de Janeiro" },
];

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
				name="state"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Estado</FormLabel>
						<FormFieldSelect
							field={field}
							placeholder="Selecione o estado"
							disabled={disabled}
							selectOptions={options}
						/>
					</FormItem>
				)}
			/>
			<span data-testid="state-value">{form.watch("state")}</span>
		</FormProvider>
	);
}

describe("FormFieldSelect", () => {
	it("renderiza o label Estado", () => {
		render(<Harness />);
		expect(screen.getByText("Estado")).toBeInTheDocument();
	});

	it("renderiza o placeholder quando não há valor selecionado", () => {
		render(<Harness />);
		expect(screen.getByText("Selecione o estado")).toBeInTheDocument();
	});

	it("renderiza todas as opções passadas em selectOptions", () => {
		render(<Harness />);
		expect(screen.getByText("São Paulo")).toBeInTheDocument();
		expect(screen.getByText("Rio de Janeiro")).toBeInTheDocument();
	});

	it("exibe o valor inicial vindo do form pai", () => {
		render(<Harness defaultValues={{ state: "RJ" }} />);
		expect(screen.getByTestId("select")).toHaveAttribute("data-value", "RJ");
	});

	it("propaga a seleção de uma opção para o form pai", async () => {
		render(<Harness />);
		await userEvent.click(screen.getByText("escolher-sp"));
		expect(screen.getByTestId("state-value")).toHaveTextContent("SP");
	});

	it("desabilita o select quando disabled é true", () => {
		render(<Harness disabled />);
		expect(screen.getByTestId("select")).toHaveAttribute(
			"data-disabled",
			"true",
		);
	});
});
