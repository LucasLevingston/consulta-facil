import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import type { UpdatePaymentSettingsInput } from "@/features/professionals";
import { PaymentTimingField } from "./PaymentTimingField";

function TimingHarness({
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
			<PaymentTimingField control={form.control} />
			<span data-testid="timing-value">{form.watch("paymentTiming")}</span>
		</FormProvider>
	);
}

describe("PaymentTimingField", () => {
	it("renderiza as opções de momento de pagamento", () => {
		render(<TimingHarness />);
		expect(screen.getByText("Momento do pagamento")).toBeInTheDocument();
		expect(screen.getByText("No agendamento")).toBeInTheDocument();
		expect(screen.getByText("Na consulta")).toBeInTheDocument();
	});

	it("clicar em uma opção propaga o valor para o form pai", async () => {
		render(<TimingHarness />);
		expect(screen.getByTestId("timing-value")).toHaveTextContent(
			"AT_CONSULTATION",
		);
		await userEvent.click(screen.getByText("No agendamento"));
		expect(screen.getByTestId("timing-value")).toHaveTextContent(
			"AT_SCHEDULING",
		);
	});
});
