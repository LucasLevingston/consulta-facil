import { act, render, screen } from "@testing-library/react";
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
		<div data-testid="identification-select" data-value={value}>
			<button type="button" onClick={() => onValueChange?.("Passaporte")}>
				escolher-passaporte
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

import { PatientIdentificationSection } from "@/components/forms/PatientDetails/PatientIdentificationSection";

type IdentificationValues = {
	identificationDocumentType: string;
	identificationDocument?: File[];
};

function Harness() {
	const form = useForm<IdentificationValues>({
		defaultValues: {
			identificationDocumentType: "",
			identificationDocument: undefined,
		},
	});
	return (
		<FormProvider {...form}>
			<PatientIdentificationSection form={form as never} />
			<span data-testid="doc-type-value">
				{form.watch("identificationDocumentType")}
			</span>
			<span data-testid="doc-file-value">
				{form.watch("identificationDocument")?.[0]?.name ?? ""}
			</span>
		</FormProvider>
	);
}

describe("PatientIdentificationSection", () => {
	it("renderiza o título da seção de identificação", () => {
		render(<Harness />);
		expect(screen.getByText("Identificação e Verificação")).toBeInTheDocument();
	});

	it("renderiza o placeholder do select de tipo de identificação", () => {
		render(<Harness />);
		expect(
			screen.getByText("Selecione o tipo de identificação"),
		).toBeInTheDocument();
	});

	it("propaga a seleção do tipo de identificação para o form pai", async () => {
		const { default: userEvent } = await import("@testing-library/user-event");
		const user = userEvent.setup();
		render(<Harness />);
		await user.click(screen.getByText("escolher-passaporte"));
		expect(screen.getByTestId("doc-type-value")).toHaveTextContent(
			"Passaporte",
		);
	});

	it("renderiza o rótulo do uploader de documento de identificação", () => {
		render(<Harness />);
		expect(
			screen.getByText("Cópia Escaneada do Documento de Identificação"),
		).toBeInTheDocument();
	});

	it("renderiza o placeholder de upload quando nenhum arquivo foi enviado", () => {
		render(<Harness />);
		expect(screen.getByText(/Clique pra fazer o upload/)).toBeInTheDocument();
	});

	it("propaga o arquivo enviado via onDrop para o form pai", () => {
		render(<Harness />);
		const file = new File(["conteudo"], "documento.png", {
			type: "image/png",
		});
		act(() => {
			capturedOnDrop?.([file]);
		});
		expect(screen.getByTestId("doc-file-value")).toHaveTextContent(
			"documento.png",
		);
	});
});
