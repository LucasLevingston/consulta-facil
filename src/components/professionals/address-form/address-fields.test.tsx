import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/professionals", () => ({}));

import { AddressCityFields } from "./AddressCityFields";

type AddressValues = {
	neighborhood?: string;
	complement?: string;
	city?: string;
	state?: string;
};

function AddressCityHarness({
	defaultValues,
}: {
	defaultValues?: AddressValues;
}) {
	const form = useForm<AddressValues>({ defaultValues });
	return (
		<FormProvider {...form}>
			<AddressCityFields control={form.control as never} />
			<span data-testid="city-value">{form.watch("city")}</span>
			<span data-testid="state-value">{form.watch("state")}</span>
		</FormProvider>
	);
}

describe("AddressCityFields", () => {
	it("renderiza os labels Bairro, Complemento, Cidade e Estado", () => {
		render(<AddressCityHarness />);
		expect(screen.getByText("Bairro")).toBeInTheDocument();
		expect(screen.getByText("Complemento")).toBeInTheDocument();
		expect(screen.getByText("Cidade")).toBeInTheDocument();
		expect(screen.getByText("Estado")).toBeInTheDocument();
	});

	it("exibe os valores iniciais vindos do form pai", () => {
		render(
			<AddressCityHarness defaultValues={{ city: "São Paulo", state: "SP" }} />,
		);
		expect(screen.getByPlaceholderText("São Paulo")).toHaveValue("São Paulo");
		expect(screen.getByPlaceholderText("SP")).toHaveValue("SP");
	});

	it("propaga a digitação em Cidade para o form pai", async () => {
		render(<AddressCityHarness />);
		const input = screen.getByPlaceholderText("São Paulo");
		await userEvent.type(input, "Curitiba");
		expect(screen.getByTestId("city-value")).toHaveTextContent("Curitiba");
	});

	it("propaga a digitação em Estado para o form pai", async () => {
		render(<AddressCityHarness />);
		const input = screen.getByPlaceholderText("SP");
		await userEvent.type(input, "rj");
		expect(screen.getByTestId("state-value")).toHaveTextContent("rj");
	});
});
