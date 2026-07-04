import { fireEvent, render, screen } from "@testing-library/react";
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

import { FileUploader } from "@/components/FileUploader";
import SearchInput from "@/components/SearchInput";

describe("FileUploader", () => {
	it("renderiza o placeholder de upload quando não há arquivos", () => {
		render(<FileUploader files={undefined} onChange={vi.fn()} />);
		expect(screen.getByText(/Clique pra fazer o upload/)).toBeInTheDocument();
	});

	it("chama onChange com o arquivo selecionado", () => {
		const onChange = vi.fn();
		render(<FileUploader files={undefined} onChange={onChange} />);
		const file = new File(["conteudo"], "exame.png", { type: "image/png" });
		const input = screen.getByTestId("file-input");
		fireEvent.change(input, { target: { files: [file] } });
		expect(onChange).toHaveBeenCalledWith([file]);
	});

	it("renderiza a imagem enviada quando já existe um arquivo", () => {
		const file = new File(["conteudo"], "exame.png", { type: "image/png" });
		render(<FileUploader files={[file]} onChange={vi.fn()} />);
		expect(screen.getByAltText("uploaded image")).toBeInTheDocument();
	});

	it("usa o onDrop capturado pelo react-dropzone para propagar arquivos", () => {
		const onChange = vi.fn();
		render(<FileUploader files={undefined} onChange={onChange} />);
		const file = new File(["conteudo"], "doc.png", { type: "image/png" });
		capturedOnDrop?.([file]);
		expect(onChange).toHaveBeenCalledWith([file]);
	});
});

describe("SearchInput", () => {
	it("renderiza o input de busca com o placeholder esperado", () => {
		render(<SearchInput />);
		expect(
			screen.getByPlaceholderText("Search for anything..."),
		).toBeInTheDocument();
	});

	it("permite digitar um termo de busca no input", () => {
		render(<SearchInput />);
		const input = screen.getByPlaceholderText(
			"Search for anything...",
		) as HTMLInputElement;
		fireEvent.change(input, { target: { value: "cardiologista" } });
		expect(input.value).toBe("cardiologista");
	});

	it("renderiza o botão de submissão da busca", () => {
		render(<SearchInput />);
		expect(
			screen.getByRole("button", { name: "Submit search" }),
		).toBeInTheDocument();
	});
});
