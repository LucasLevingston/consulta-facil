import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/professionals", () => ({}));
vi.mock("@/features/professionals/hooks/use-address-form", () => ({
	useAddressForm: vi.fn(),
}));
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

import { useAddressForm } from "@/features/professionals/hooks/use-address-form";
import { AddressForm } from "./AddressForm";

const mockUseAddressForm = vi.mocked(useAddressForm);

const professional = { id: "p-1" } as never;

function makeForm(onSubmit = vi.fn()) {
	return {
		form: {
			control: {},
			handleSubmit: (fn: (data: object) => void) => (e: React.FormEvent) => {
				e.preventDefault();
				fn({});
			},
		} as never,
		onSubmit,
		isPending: false,
	};
}

describe("AddressForm", () => {
	it("renderiza o título 'Endereço do consultório'", () => {
		mockUseAddressForm.mockReturnValue(makeForm());
		render(<AddressForm professional={professional} />);
		expect(screen.getByText("Endereço do consultório")).toBeInTheDocument();
	});

	it("renderiza o botão Salvar", () => {
		mockUseAddressForm.mockReturnValue(makeForm());
		render(<AddressForm professional={professional} />);
		expect(screen.getByText("Salvar")).toBeInTheDocument();
	});

	it("exibe 'Salvando...' quando isPending é true", () => {
		mockUseAddressForm.mockReturnValue({
			...makeForm(),
			isPending: true,
		});
		render(<AddressForm professional={professional} />);
		expect(screen.getByText("Salvando...")).toBeInTheDocument();
	});

	it("chama onSubmit ao submeter o formulário", async () => {
		const onSubmit = vi.fn();
		mockUseAddressForm.mockReturnValue(makeForm(onSubmit));
		render(<AddressForm professional={professional} />);
		await userEvent.click(screen.getByText("Salvar"));
		expect(onSubmit).toHaveBeenCalledTimes(1);
	});
});
