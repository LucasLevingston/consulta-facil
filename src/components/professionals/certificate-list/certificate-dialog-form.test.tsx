import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/professionals", () => ({}));
vi.mock("@/components/ui/form", () => ({
	Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	FormField: ({
		name,
		render,
	}: {
		name: string;
		render: (arg: { field: object }) => React.ReactNode;
	}) => <div>{render({ field: { value: "", onChange: vi.fn(), name } })}</div>,
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
vi.mock("@/components/ui/button", () => ({
	Button: ({
		children,
		onClick,
		disabled,
	}: {
		children: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
	}) => (
		<button type="button" onClick={onClick} disabled={disabled}>
			{children}
		</button>
	),
}));
vi.mock("./CertificateOptionalFields", () => ({
	CertificateOptionalFields: () => null,
}));

import { CertificateDialogForm } from "./CertificateDialogForm";

const form = {
	control: {},
	handleSubmit: (fn: (data: object) => void) => (e: React.FormEvent) => {
		e.preventDefault();
		fn({});
	},
} as never;

describe("CertificateDialogForm render", () => {
	it("renders Título label", () => {
		render(
			<CertificateDialogForm
				form={form}
				isPending={false}
				onSubmit={vi.fn()}
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Título")).toBeInTheDocument();
	});

	it("renders Cancelar and Salvar buttons", () => {
		render(
			<CertificateDialogForm
				form={form}
				isPending={false}
				onSubmit={vi.fn()}
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
		expect(screen.getByText("Salvar")).toBeInTheDocument();
	});
});
