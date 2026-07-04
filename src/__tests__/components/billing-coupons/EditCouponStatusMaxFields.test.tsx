import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Control, FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		defaultValue,
		disabled,
		onValueChange,
	}: {
		children: React.ReactNode;
		defaultValue?: string;
		disabled?: boolean;
		onValueChange?: (v: string) => void;
	}) => (
		<div
			data-testid="select"
			data-value={defaultValue}
			data-disabled={disabled}
		>
			<button type="button" onClick={() => onValueChange?.("INACTIVE")}>
				escolher-inativo
			</button>
			{children}
		</div>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectValue: () => null,
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <div data-value={value}>{children}</div>,
}));

import { EditCouponStatusMaxFields } from "@/components/billing/coupons/EditCouponStatusMaxFields";
import type { UpdateCouponData } from "@/features/billing";

function Harness({
	defaultValues,
}: {
	defaultValues?: Partial<UpdateCouponData>;
}) {
	const form = useForm<UpdateCouponData>({ defaultValues });
	return (
		<FormProvider {...form}>
			<EditCouponStatusMaxFields
				control={form.control as unknown as Control<FieldValues> as never}
			/>
			<span data-testid="status-value">
				{String(form.watch("status") ?? "")}
			</span>
			<span data-testid="max-uses-value">
				{String(form.watch("maxUses") ?? "")}
			</span>
		</FormProvider>
	);
}

describe("EditCouponStatusMaxFields", () => {
	it("renderiza o label Status", () => {
		render(<Harness />);
		expect(screen.getByText("Status")).toBeInTheDocument();
	});

	it("renderiza o label Máx. usos total", () => {
		render(<Harness />);
		expect(screen.getByText("Máx. usos total")).toBeInTheDocument();
	});

	it("renderiza as opções Ativo e Inativo", () => {
		render(<Harness />);
		expect(screen.getByText("Ativo")).toBeInTheDocument();
		expect(screen.getByText("Inativo")).toBeInTheDocument();
	});

	it("exibe o status inicial vindo do form pai", () => {
		render(<Harness defaultValues={{ status: "ACTIVE" }} />);
		expect(screen.getByTestId("select")).toHaveAttribute(
			"data-value",
			"ACTIVE",
		);
	});

	it("propaga a mudança de status para o form pai", async () => {
		render(<Harness defaultValues={{ status: "ACTIVE" }} />);
		await userEvent.click(screen.getByText("escolher-inativo"));
		expect(screen.getByTestId("status-value")).toHaveTextContent("INACTIVE");
	});

	it("propaga o valor digitado em maxUses para o form pai", async () => {
		render(<Harness />);
		const input = screen.getByPlaceholderText("Ilimitado");
		await userEvent.type(input, "12");
		expect(screen.getByTestId("max-uses-value")).toHaveTextContent("12");
	});

	it("mantém maxUses indefinido quando o campo é limpo (NaN vira undefined)", async () => {
		render(<Harness defaultValues={{ maxUses: 5 }} />);
		const input = screen.getByPlaceholderText("Ilimitado");
		await userEvent.clear(input);
		expect(screen.getByTestId("max-uses-value")).toHaveTextContent("");
	});
});
