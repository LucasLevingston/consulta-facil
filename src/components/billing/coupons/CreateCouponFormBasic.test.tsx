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
vi.mock("@/components/billing/coupons/CouponTypeValueGrid", () => ({
	CouponTypeValueGrid: () => <div>type-value-grid</div>,
}));

import { CreateCouponFormBasic } from "./CreateCouponFormBasic";

const form = {
	control: {},
} as never;

describe("CreateCouponFormBasic", () => {
	it("renders Código label", () => {
		render(<CreateCouponFormBasic form={form} />);
		expect(screen.getByText("Código")).toBeInTheDocument();
	});

	it("renders Descrição label", () => {
		render(<CreateCouponFormBasic form={form} />);
		expect(screen.getByText("Descrição")).toBeInTheDocument();
	});

	it("renders CouponTypeValueGrid", () => {
		render(<CreateCouponFormBasic form={form} />);
		expect(screen.getByText("type-value-grid")).toBeInTheDocument();
	});

	it("renders DESCONTO20 placeholder", () => {
		render(<CreateCouponFormBasic form={form} />);
		expect(screen.getByPlaceholderText("DESCONTO20")).toBeInTheDocument();
	});
});
