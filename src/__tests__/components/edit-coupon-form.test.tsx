import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing", () => ({}));
vi.mock("@/components/ui/form", () => ({
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
		disabled,
	}: {
		children: React.ReactNode;
		disabled?: boolean;
	}) => (
		<button type="button" disabled={disabled}>
			{children}
		</button>
	),
}));
vi.mock("@/components/billing/coupons/EditCouponStatusMaxFields", () => ({
	EditCouponStatusMaxFields: () => <div>status-max-fields</div>,
}));

import { EditCouponForm } from "@/components/billing/coupons/EditCouponForm";

describe("EditCouponForm", () => {
	it("renders Descrição label", () => {
		render(
			<EditCouponForm
				control={{} as never}
				onSubmit={vi.fn()}
				isPending={false}
			/>,
		);
		expect(screen.getByText("Descrição")).toBeInTheDocument();
	});

	it("renders Expira em label", () => {
		render(
			<EditCouponForm
				control={{} as never}
				onSubmit={vi.fn()}
				isPending={false}
			/>,
		);
		expect(screen.getByText("Expira em")).toBeInTheDocument();
	});

	it("renders Salvar button when not pending", () => {
		render(
			<EditCouponForm
				control={{} as never}
				onSubmit={vi.fn()}
				isPending={false}
			/>,
		);
		expect(screen.getByText("Salvar")).toBeInTheDocument();
	});
});
