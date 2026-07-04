import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
	default: ({
		src,
		alt,
		...props
	}: {
		src: string;
		alt: string;
		[key: string]: unknown;
	}) => (
		// biome-ignore lint/performance/noImgElement: mock
		<img src={src} alt={alt} {...props} />
	),
}));
vi.mock("@/lib/utils/convert-file-to-url", () => ({
	convertFileToUrl: vi.fn(() => "blob:mock-url"),
}));
vi.mock("react-dropzone", () => ({
	useDropzone: ({ onDrop }: { onDrop: (files: File[]) => void }) => ({
		getRootProps: () => ({}),
		getInputProps: () => ({
			"data-testid": "file-input",
			type: "file",
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
				onDrop(Array.from(e.target.files ?? []));
			},
		}),
	}),
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
		<div data-testid="gender-select" data-value={value}>
			<button type="button" onClick={() => onValueChange?.("FEMALE")}>
				escolher-mulher
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

import { PatientPersonalSection } from "@/components/forms/PatientDetails/PatientPersonalSection";

type PersonalValues = {
	name: string;
	email: string;
	phone: string;
	imageProfile?: File[];
	gender: string;
	cpf: string;
	address: string;
	occupation: string;
	emergencyContactName: string;
	emergencyContactNumber: string;
};

function Harness() {
	const form = useForm<PersonalValues>({
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			imageProfile: undefined,
			gender: "",
			cpf: "",
			address: "",
			occupation: "",
			emergencyContactName: "",
			emergencyContactNumber: "",
		},
	});
	return (
		<FormProvider {...form}>
			<PatientPersonalSection form={form as never} />
			<span data-testid="cpf-value">{form.watch("cpf")}</span>
			<span data-testid="address-value">{form.watch("address")}</span>
			<span data-testid="occupation-value">{form.watch("occupation")}</span>
			<span data-testid="emergency-name-value">
				{form.watch("emergencyContactName")}
			</span>
			<span data-testid="emergency-number-value">
				{form.watch("emergencyContactNumber")}
			</span>
		</FormProvider>
	);
}

describe("PatientPersonalSection", () => {
	it("renderiza o título da seção de informações pessoais", () => {
		render(<Harness />);
		expect(screen.getByText("Informações Pessoais")).toBeInTheDocument();
	});

	it("renderiza as colunas superiores (nome, e-mail, telefone) vindas de PatientPersonalTopColumns", () => {
		render(<Harness />);
		expect(screen.getByText("Nome completo")).toBeInTheDocument();
		expect(screen.getByText("Endereço de E-mail")).toBeInTheDocument();
		expect(screen.getByText("Número de Telefone")).toBeInTheDocument();
	});

	it("renderiza os rótulos de CPF, endereço, ocupação e contato de emergência", () => {
		render(<Harness />);
		expect(screen.getByText("CPF")).toBeInTheDocument();
		expect(screen.getByText("Endereço")).toBeInTheDocument();
		expect(screen.getByText("Ocupação")).toBeInTheDocument();
		expect(
			screen.getByText("Nome do Contato de Emergência"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Número do Contato de Emergência"),
		).toBeInTheDocument();
	});

	it("propaga o cpf digitado para o form pai", async () => {
		const user = userEvent.setup();
		render(<Harness />);
		await user.type(screen.getByPlaceholderText("12345678900"), "12345678900");
		expect(screen.getByTestId("cpf-value")).toHaveTextContent("12345678900");
	});

	it("propaga o endereço digitado para o form pai", async () => {
		const user = userEvent.setup();
		render(<Harness />);
		await user.type(
			screen.getByPlaceholderText("14 rua, Nova Iorque, NY - 5101"),
			"Rua das Flores, 123",
		);
		expect(screen.getByTestId("address-value")).toHaveTextContent(
			"Rua das Flores, 123",
		);
	});

	it("propaga o nome do contato de emergência digitado para o form pai", async () => {
		const user = userEvent.setup();
		render(<Harness />);
		await user.type(
			screen.getByPlaceholderText("Nome do responsável"),
			"Maria Silva",
		);
		expect(screen.getByTestId("emergency-name-value")).toHaveTextContent(
			"Maria Silva",
		);
	});

	it("usa o tipo tel nos dois campos com placeholder de telefone", () => {
		render(<Harness />);
		const phoneInputs = screen.getAllByPlaceholderText("(11) 91234-5678");
		expect(phoneInputs).toHaveLength(2);
		for (const input of phoneInputs) {
			expect(input).toHaveAttribute("type", "tel");
		}
	});
});
