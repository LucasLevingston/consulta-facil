import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing", () => ({}));
vi.mock("@/components/ui/form", () => ({
	FormField: ({
		render: r,
		name,
	}: {
		render: (args: {
			field: { value: string; onChange: () => void; name: string };
		}) => React.ReactNode;
		name: string;
	}) => r({ field: { value: "", onChange: vi.fn(), name } }),
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
vi.mock("@/components/ui/select", () => ({
	Select: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
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

import { CouponTypeValueGrid } from "@/components/billing/coupons/CouponTypeValueGrid";

const control = {} as never;

describe("CouponTypeValueGrid", () => {
	it("renders Tipo label", () => {
		render(<CouponTypeValueGrid control={control} />);
		expect(screen.getByText("Tipo")).toBeInTheDocument();
	});

	it("renders Valor label", () => {
		render(<CouponTypeValueGrid control={control} />);
		expect(screen.getByText("Valor")).toBeInTheDocument();
	});

	it("renders Percentual option", () => {
		render(<CouponTypeValueGrid control={control} />);
		expect(screen.getByText("Percentual (%)")).toBeInTheDocument();
	});

	it("renders Fixo option", () => {
		render(<CouponTypeValueGrid control={control} />);
		expect(screen.getByText("Fixo (R$)")).toBeInTheDocument();
	});
});
