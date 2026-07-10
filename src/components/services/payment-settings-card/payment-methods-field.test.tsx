import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import type { UpdatePaymentSettingsInput } from "@/features/professionals";

vi.mock("@/components/ui/checkbox", () => ({
	Checkbox: ({
		checked,
		onCheckedChange,
		...props
	}: {
		checked?: boolean;
		onCheckedChange?: (v: boolean) => void;
	} & Record<string, unknown>) => (
		<input
			type="checkbox"
			checked={!!checked}
			onChange={(e) => onCheckedChange?.(e.target.checked)}
			{...props}
		/>
	),
}));

import { PaymentMethodsField } from "./PaymentMethodsField";

function MethodsHarness({
	defaultValues,
}: {
	defaultValues?: Partial<UpdatePaymentSettingsInput>;
}) {
	const form = useForm<UpdatePaymentSettingsInput>({
		defaultValues: {
			paymentTiming: "AT_CONSULTATION",
			acceptedPaymentMethods: [],
			...defaultValues,
		},
	});
	return (
		<FormProvider {...form}>
			<PaymentMethodsField control={form.control} />
			<span data-testid="methods-value">
				{form.watch("acceptedPaymentMethods").join(",")}
			</span>
		</FormProvider>
	);
}

describe("PaymentMethodsField", () => {
	it("renderiza o label e todos os métodos de pagamento", () => {
		render(<MethodsHarness />);
		expect(screen.getByText("Métodos aceitos")).toBeInTheDocument();
		expect(screen.getByText("MercadoPago")).toBeInTheDocument();
		expect(screen.getByText("Pix")).toBeInTheDocument();
		expect(screen.getByText("Cartão de Crédito")).toBeInTheDocument();
		expect(screen.getByText("Cartão de Débito")).toBeInTheDocument();
		expect(screen.getByText("Dinheiro")).toBeInTheDocument();
	});

	it("marcar um método propaga o valor para o form pai", async () => {
		render(<MethodsHarness />);
		const checkboxes = screen.getAllByRole("checkbox");
		// ALL_METHODS: MERCADOPAGO, PIX, CREDIT_CARD, DEBIT_CARD, CASH
		await userEvent.click(checkboxes[1]);
		expect(screen.getByTestId("methods-value")).toHaveTextContent("PIX");
	});

	it("desmarcar um método remove o valor do form pai", async () => {
		render(
			<MethodsHarness
				defaultValues={{ acceptedPaymentMethods: ["PIX", "CASH"] }}
			/>,
		);
		const checkboxes = screen.getAllByRole("checkbox");
		expect(screen.getByTestId("methods-value")).toHaveTextContent("PIX,CASH");
		await userEvent.click(checkboxes[1]);
		expect(screen.getByTestId("methods-value")).toHaveTextContent("CASH");
		expect(screen.getByTestId("methods-value")).not.toHaveTextContent("PIX,");
	});
});
