import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/professionals", () => ({}));

import { AddressStreetFields } from "./AddressStreetFields";

type AddressValues = {
	zipCode?: string;
	address?: string;
	streetNumber?: string;
};

function AddressStreetHarness({
	defaultValues,
}: {
	defaultValues?: AddressValues;
}) {
	const form = useForm<AddressValues>({ defaultValues });
	return (
		<FormProvider {...form}>
			<AddressStreetFields control={form.control as never} />
			<span data-testid="zip-value">{form.watch("zipCode")}</span>
			<span data-testid="address-value">{form.watch("address")}</span>
		</FormProvider>
	);
}

describe("AddressStreetFields", () => {
	it("renderiza os labels CEP, Logradouro e Número", () => {
		render(<AddressStreetHarness />);
		expect(screen.getByText("CEP")).toBeInTheDocument();
		expect(screen.getByText("Logradouro")).toBeInTheDocument();
		expect(screen.getByText("Número")).toBeInTheDocument();
	});

	it("exibe os valores iniciais vindos do form pai", () => {
		render(
			<AddressStreetHarness
				defaultValues={{ zipCode: "01000-000", address: "Rua das Flores" }}
			/>,
		);
		expect(screen.getByPlaceholderText("00000-000")).toHaveValue("01000-000");
		expect(screen.getByPlaceholderText("Rua, Av...")).toHaveValue(
			"Rua das Flores",
		);
	});

	it("propaga a digitação em CEP para o form pai", async () => {
		render(<AddressStreetHarness />);
		const input = screen.getByPlaceholderText("00000-000");
		await userEvent.type(input, "12345-000");
		expect(screen.getByTestId("zip-value")).toHaveTextContent("12345-000");
	});

	it("propaga a digitação em Logradouro para o form pai", async () => {
		render(<AddressStreetHarness />);
		const input = screen.getByPlaceholderText("Rua, Av...");
		await userEvent.type(input, "Av. Paulista");
		expect(screen.getByTestId("address-value")).toHaveTextContent(
			"Av. Paulista",
		);
	});
});
