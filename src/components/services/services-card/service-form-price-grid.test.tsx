import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import type { CreateServiceInput } from "@/features/services";
import { createServiceSchema } from "@/features/services";
import { ServiceFormPriceGrid } from "./ServiceFormPriceGrid";

function PriceGridHarness({
	defaultValues,
}: {
	defaultValues?: Partial<CreateServiceInput>;
}) {
	const form = useForm<CreateServiceInput>({
		resolver: zodResolver(createServiceSchema),
		defaultValues: {
			name: "Serviço válido",
			description: "",
			price: 100,
			durationMinutes: 30,
			requiresConsultation: false,
			...defaultValues,
		},
	});
	return (
		<form onSubmit={form.handleSubmit(() => {})}>
			<ServiceFormPriceGrid form={form} />
			<button type="submit">validar</button>
			<span data-testid="price-value">{form.watch("price")}</span>
			<span data-testid="duration-value">{form.watch("durationMinutes")}</span>
		</form>
	);
}

describe("ServiceFormPriceGrid", () => {
	it("renderiza os labels de Preço e Duração", () => {
		render(<PriceGridHarness />);
		expect(screen.getByText("Preço (R$) *")).toBeInTheDocument();
		expect(screen.getByText("Duração (min) *")).toBeInTheDocument();
	});

	it("digitar novos valores propaga para o form pai", async () => {
		render(<PriceGridHarness />);
		const priceInput = screen.getByLabelText("Preço (R$) *");
		await userEvent.clear(priceInput);
		await userEvent.type(priceInput, "250");
		expect(screen.getByTestId("price-value")).toHaveTextContent("250");

		const durationInput = screen.getByLabelText("Duração (min) *");
		await userEvent.clear(durationInput);
		await userEvent.type(durationInput, "60");
		expect(screen.getByTestId("duration-value")).toHaveTextContent("60");
	});

	it("mostra erro de validação quando o preço é inválido", async () => {
		render(<PriceGridHarness defaultValues={{ price: 0 }} />);
		await userEvent.click(screen.getByText("validar"));
		expect(
			await screen.findByText("Preço deve ser positivo"),
		).toBeInTheDocument();
	});
});
