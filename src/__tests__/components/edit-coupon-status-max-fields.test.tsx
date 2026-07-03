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

import { EditCouponStatusMaxFields } from "@/components/billing/coupons/EditCouponStatusMaxFields";

const control = {} as never;

describe("EditCouponStatusMaxFields", () => {
	it("renders Status label", () => {
		render(<EditCouponStatusMaxFields control={control} />);
		expect(screen.getByText("Status")).toBeInTheDocument();
	});

	it("renders Máx. usos label", () => {
		render(<EditCouponStatusMaxFields control={control} />);
		expect(screen.getByText("Máx. usos total")).toBeInTheDocument();
	});

	it("renders Ativo option", () => {
		render(<EditCouponStatusMaxFields control={control} />);
		expect(screen.getByText("Ativo")).toBeInTheDocument();
	});

	it("renders Inativo option", () => {
		render(<EditCouponStatusMaxFields control={control} />);
		expect(screen.getByText("Inativo")).toBeInTheDocument();
	});
});
