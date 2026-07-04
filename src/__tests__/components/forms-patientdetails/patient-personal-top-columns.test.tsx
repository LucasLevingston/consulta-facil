import { act, render, screen } from "@testing-library/react";
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

let capturedOnDrop: ((files: File[]) => void) | null = null;
vi.mock("react-dropzone", () => ({
	useDropzone: ({ onDrop }: { onDrop: (files: File[]) => void }) => {
		capturedOnDrop = onDrop;
		return {
			getRootProps: () => ({}),
			getInputProps: () => ({
				"data-testid": "file-input",
				type: "file",
				onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
					onDrop(Array.from(e.target.files ?? []));
				},
			}),
		};
	},
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

import { PatientPersonalTopColumns } from "@/components/forms/PatientDetails/PatientPersonalTopColumns";

type TopColumnsValues = {
	name: string;
	email: string;
	phone: string;
	imageProfile?: File[];
	gender: string;
};

function Harness() {
	const form = useForm<TopColumnsValues>({
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			imageProfile: undefined,
			gender: "",
		},
	});
	return (
		<FormProvider {...form}>
			<PatientPersonalTopColumns form={form as never} />
			<span data-testid="name-value">{form.watch("name")}</span>
			<span data-testid="email-value">{form.watch("email")}</span>
			<span data-testid="phone-value">{form.watch("phone")}</span>
			<span data-testid="gender-value">{form.watch("gender")}</span>
			<span data-testid="image-value">
				{form.watch("imageProfile")?.[0]?.name ?? ""}
			</span>
		</FormProvider>
	);
}

describe("PatientPersonalTopColumns", () => {
	it("renderiza os rótulos de nome, e-mail, telefone, foto de perfil e gênero", () => {
		render(<Harness />);
		expect(screen.getByText("Nome completo")).toBeInTheDocument();
		expect(screen.getByText("Endereço de E-mail")).toBeInTheDocument();
		expect(screen.getByText("Número de Telefone")).toBeInTheDocument();
		expect(screen.getByText("Foto de perfil")).toBeInTheDocument();
		expect(screen.getByText("Gênero")).toBeInTheDocument();
	});

	it("propaga o nome digitado para o form pai", async () => {
		const user = userEvent.setup();
		render(<Harness />);
		await user.type(
			screen.getByPlaceholderText("João da Silva"),
			"Maria Souza",
		);
		expect(screen.getByTestId("name-value")).toHaveTextContent("Maria Souza");
	});

	it("propaga o telefone digitado para o form pai", async () => {
		const user = userEvent.setup();
		render(<Harness />);
		const phoneInput = screen.getByPlaceholderText("(11) 91234-5678");
		expect(phoneInput).toHaveAttribute("type", "tel");
		await user.type(phoneInput, "11988887777");
		expect(screen.getByTestId("phone-value")).toHaveTextContent("11988887777");
	});

	it("propaga a seleção de gênero para o form pai", async () => {
		const user = userEvent.setup();
		render(<Harness />);
		await user.click(screen.getByText("escolher-mulher"));
		expect(screen.getByTestId("gender-value")).toHaveTextContent("FEMALE");
	});

	it("propaga o arquivo de foto de perfil enviado via onDrop para o form pai", () => {
		render(<Harness />);
		const file = new File(["conteudo"], "foto.png", { type: "image/png" });
		act(() => {
			capturedOnDrop?.([file]);
		});
		expect(screen.getByTestId("image-value")).toHaveTextContent("foto.png");
	});
});
