import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
vi.mock("@/components/ui/textarea", () => ({
	Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
		<textarea {...props} />
	),
}));
vi.mock("@/components/ui/button", () => ({
	Button: ({
		children,
		onClick,
		disabled,
		type,
	}: {
		children: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
		type?: "button" | "submit" | "reset";
	}) => (
		<button type={type ?? "button"} onClick={onClick} disabled={disabled}>
			{children}
		</button>
	),
}));
vi.mock("./ExperienceYearFields", () => ({
	ExperienceYearFields: () => null,
}));

import { ExperienceDialogForm } from "./ExperienceDialogForm";

const formProp = {
	control: {},
	handleSubmit: (fn: (data: object) => void) => (e: React.FormEvent) => {
		e.preventDefault();
		fn({});
	},
} as never;

describe("ExperienceDialogForm render", () => {
	it("renderiza o label 'Cargo'", () => {
		render(
			<ExperienceDialogForm
				form={formProp}
				isPending={false}
				onSubmit={vi.fn()}
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Cargo")).toBeInTheDocument();
	});

	it("renderiza o label 'Descrição (opcional)'", () => {
		render(
			<ExperienceDialogForm
				form={formProp}
				isPending={false}
				onSubmit={vi.fn()}
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Descrição (opcional)")).toBeInTheDocument();
	});

	it("renderiza os botões Cancelar e Salvar", () => {
		render(
			<ExperienceDialogForm
				form={formProp}
				isPending={false}
				onSubmit={vi.fn()}
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
		expect(screen.getByText("Salvar")).toBeInTheDocument();
	});

	it("chama onClose ao clicar em Cancelar", async () => {
		const onClose = vi.fn();
		render(
			<ExperienceDialogForm
				form={formProp}
				isPending={false}
				onSubmit={vi.fn()}
				onClose={onClose}
			/>,
		);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("chama onSubmit ao submeter o form", async () => {
		const onSubmit = vi.fn();
		render(
			<ExperienceDialogForm
				form={formProp}
				isPending={false}
				onSubmit={onSubmit}
				onClose={vi.fn()}
			/>,
		);
		await userEvent.click(screen.getByText("Salvar"));
		expect(onSubmit).toHaveBeenCalledTimes(1);
	});
});
