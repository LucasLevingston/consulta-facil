import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { CreateCouponFormLimits } from "@/components/billing/coupons/CreateCouponFormLimits";
import type { CreateCouponData } from "@/features/billing";

function Harness({ isPending = false }: { isPending?: boolean }) {
	const form = useForm<CreateCouponData>({
		defaultValues: { type: "PERCENT", maxUsesPerUser: 1 },
	});
	return (
		<FormProvider {...form}>
			<CreateCouponFormLimits form={form} isPending={isPending} />
			<span data-testid="max-uses">{String(form.watch("maxUses") ?? "")}</span>
			<span data-testid="max-uses-per-user">
				{String(form.watch("maxUsesPerUser") ?? "")}
			</span>
			<span data-testid="expires-at">
				{String(form.watch("expiresAt") ?? "")}
			</span>
		</FormProvider>
	);
}

describe("CreateCouponFormLimits", () => {
	it("renderiza o label Máx. usos total", () => {
		render(<Harness />);
		expect(screen.getByText("Máx. usos total")).toBeInTheDocument();
	});

	it("renderiza o label Máx. por usuário", () => {
		render(<Harness />);
		expect(screen.getByText("Máx. por usuário")).toBeInTheDocument();
	});

	it("renderiza o label Expira em", () => {
		render(<Harness />);
		expect(screen.getByText("Expira em")).toBeInTheDocument();
	});

	it("exibe o texto Criar Cupom no botão quando não está pendente", () => {
		render(<Harness isPending={false} />);
		expect(
			screen.getByRole("button", { name: "Criar Cupom" }),
		).toBeInTheDocument();
		expect(screen.getByRole("button")).not.toBeDisabled();
	});

	it("exibe o texto Criando... e desabilita o botão quando está pendente", () => {
		render(<Harness isPending={true} />);
		expect(screen.getByRole("button", { name: "Criando..." })).toBeDisabled();
	});

	it("propaga o valor digitado em maxUses para o form pai", async () => {
		render(<Harness />);
		const input = screen.getByPlaceholderText("Ilimitado");
		await userEvent.type(input, "5");
		expect(screen.getByTestId("max-uses")).toHaveTextContent("5");
	});

	it("propaga o valor digitado em maxUsesPerUser para o form pai", async () => {
		render(<Harness />);
		const inputs = screen.getAllByRole("spinbutton");
		const maxUsesPerUserInput = inputs[1];
		await userEvent.clear(maxUsesPerUserInput);
		await userEvent.type(maxUsesPerUserInput, "3");
		expect(screen.getByTestId("max-uses-per-user")).toHaveTextContent("3");
	});

	it("propaga a data digitada em expiresAt para o form pai", async () => {
		render(<Harness />);
		const dateInput = screen.getByLabelText("Expira em");
		await userEvent.type(dateInput, "2026-12-31");
		expect(screen.getByTestId("expires-at")).toHaveTextContent("2026-12-31");
	});
});
