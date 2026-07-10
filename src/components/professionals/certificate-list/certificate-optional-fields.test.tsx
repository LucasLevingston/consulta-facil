import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/professionals", () => ({}));
vi.mock("@/components/ui/form", () => ({
	FormField: ({
		render: r,
		name,
	}: {
		render: (args: {
			field: { value: string; onChange: () => void; name: string };
		}) => React.ReactNode;
		name: string;
	}) => r({ field: { value: "", onChange: vi.fn(), name } }),
	FormItem: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	FormLabel: ({ children }: { children: React.ReactNode }) => (
		<span>{children}</span>
	),
	FormControl: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	FormMessage: () => null,
}));
vi.mock("@/components/ui/input", () => ({
	Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
		<input {...props} />
	),
}));

import { CertificateOptionalFields } from "./CertificateOptionalFields";

const mockForm = { control: {} } as never;

describe("CertificateOptionalFields", () => {
	it("renders Instituição emissora label", () => {
		render(<CertificateOptionalFields form={mockForm} />);
		expect(screen.getByText("Instituição emissora")).toBeInTheDocument();
	});

	it("renders Ano de emissão label", () => {
		render(<CertificateOptionalFields form={mockForm} />);
		expect(screen.getByText("Ano de emissão")).toBeInTheDocument();
	});

	it("renders Link do certificado label", () => {
		render(<CertificateOptionalFields form={mockForm} />);
		expect(
			screen.getByText("Link do certificado (opcional)"),
		).toBeInTheDocument();
	});

	it("renders 3 input fields", () => {
		const { container } = render(<CertificateOptionalFields form={mockForm} />);
		expect(container.querySelectorAll("input")).toHaveLength(3);
	});
});
