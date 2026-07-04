import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

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
			<button type="button" onClick={() => onValueChange?.("RJ")}>
				escolher-rj
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

import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";

type Values = {
	name?: string;
	email?: string;
	password?: string;
	notes?: string;
	state?: string;
	birthDate?: string;
	agree?: boolean;
};

function Harness({
	name,
	fieldType,
	label,
	placeholder,
	disabled,
	className,
	selectOptions,
	defaultValues,
}: {
	name: keyof Values;
	fieldType: FormFieldType;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	selectOptions?: { value: string; label: string }[];
	defaultValues?: Values;
}) {
	const form = useForm<Values>({ defaultValues });
	return (
		<FormProvider {...form}>
			<CustomFormField
				form={form}
				name={name}
				fieldType={fieldType}
				label={label}
				placeholder={placeholder}
				disabled={disabled}
				className={className}
				selectOptions={selectOptions}
			/>
			<span data-testid="field-value">{String(form.watch(name) ?? "")}</span>
		</FormProvider>
	);
}

describe("CustomFormField", () => {
	it("renderiza um input de texto para fieldType INPUT", () => {
		render(<Harness name="name" fieldType={FormFieldType.INPUT} />);
		const input = screen.getByPlaceholderText("Digite seu nome");
		expect(input).toHaveAttribute("type", "text");
	});

	it("usa o label padrão via getLabelByFormName quando label não é informado", () => {
		render(<Harness name="email" fieldType={FormFieldType.EMAIL} />);
		expect(screen.getByText("E-mail")).toBeInTheDocument();
	});

	it("usa o placeholder padrão via getPlaceholderByFormName quando placeholder não é informado", () => {
		render(<Harness name="email" fieldType={FormFieldType.EMAIL} />);
		expect(screen.getByPlaceholderText("seu@exemplo.com")).toBeInTheDocument();
	});

	it("usa o label customizado quando informado, sobrepondo o padrão", () => {
		render(
			<Harness
				name="name"
				fieldType={FormFieldType.INPUT}
				label="Nome completo"
			/>,
		);
		expect(screen.getByText("Nome completo")).toBeInTheDocument();
		expect(screen.queryByText("Nome")).not.toBeInTheDocument();
	});

	it("não renderiza nenhum label quando label é uma string vazia", () => {
		render(<Harness name="name" fieldType={FormFieldType.INPUT} label="" />);
		expect(screen.queryByText("Nome")).not.toBeInTheDocument();
	});

	it("renderiza um input type=email quando fieldType é EMAIL", () => {
		render(<Harness name="email" fieldType={FormFieldType.EMAIL} />);
		expect(screen.getByPlaceholderText("seu@exemplo.com")).toHaveAttribute(
			"type",
			"email",
		);
	});

	it("renderiza o campo de senha quando fieldType é PASSWORD", () => {
		render(
			<Harness
				name="password"
				fieldType={FormFieldType.PASSWORD}
				placeholder="Sua senha"
			/>,
		);
		expect(screen.getByPlaceholderText("Sua senha")).toHaveAttribute(
			"type",
			"password",
		);
	});

	it("renderiza um textarea quando fieldType é TEXTAREA", () => {
		render(
			<Harness
				name="notes"
				fieldType={FormFieldType.TEXTAREA}
				placeholder="Observações aqui"
			/>,
		);
		expect(screen.getByPlaceholderText("Observações aqui").tagName).toBe(
			"TEXTAREA",
		);
	});

	it("renderiza um select com as opções informadas quando fieldType é SELECT", () => {
		render(
			<Harness
				name="state"
				fieldType={FormFieldType.SELECT}
				placeholder="Selecione o estado"
				selectOptions={[
					{ value: "SP", label: "São Paulo" },
					{ value: "RJ", label: "Rio de Janeiro" },
				]}
			/>,
		);
		expect(screen.getByText("São Paulo")).toBeInTheDocument();
		expect(screen.getByText("Rio de Janeiro")).toBeInTheDocument();
	});

	it("propaga a seleção de uma opção do SELECT para o form pai", async () => {
		render(
			<Harness
				name="state"
				fieldType={FormFieldType.SELECT}
				selectOptions={[{ value: "RJ", label: "Rio de Janeiro" }]}
			/>,
		);
		await userEvent.click(screen.getByText("escolher-rj"));
		expect(screen.getByTestId("field-value")).toHaveTextContent("RJ");
	});

	it("renderiza o date picker quando fieldType é DATE_PICKER", async () => {
		render(
			<Harness
				name="birthDate"
				fieldType={FormFieldType.DATE_PICKER}
				placeholder="Selecione uma data"
			/>,
		);
		expect(
			screen.getByRole("button", { name: /Selecione uma data/ }),
		).toBeInTheDocument();
	});

	it("não renderiza o label para fieldType CHECKBOX", () => {
		render(
			<Harness
				name="agree"
				fieldType={FormFieldType.CHECKBOX}
				label="Aceito"
			/>,
		);
		expect(screen.queryByText("Aceito")).not.toBeInTheDocument();
	});

	it("desabilita o campo quando disabled é true", () => {
		render(<Harness name="name" fieldType={FormFieldType.INPUT} disabled />);
		expect(screen.getByPlaceholderText("Digite seu nome")).toBeDisabled();
	});

	it("propaga a digitação para o form pai", async () => {
		render(<Harness name="name" fieldType={FormFieldType.INPUT} />);
		const input = screen.getByPlaceholderText("Digite seu nome");
		await userEvent.type(input, "Maria");
		expect(screen.getByTestId("field-value")).toHaveTextContent("Maria");
	});

	it("exibe o valor inicial vindo do form pai", () => {
		render(
			<Harness
				name="name"
				fieldType={FormFieldType.INPUT}
				defaultValues={{ name: "João" }}
			/>,
		);
		expect(screen.getByPlaceholderText("Digite seu nome")).toHaveValue("João");
	});

	it("aplica a className informada no FormItem", () => {
		const { container } = render(
			<Harness
				name="name"
				fieldType={FormFieldType.INPUT}
				className="minha-classe"
			/>,
		);
		expect(container.querySelector(".minha-classe")).toBeInTheDocument();
	});
});
