import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/patients", () => ({}));
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
vi.mock("@/components/ui/textarea", () => ({
	Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
		<textarea {...props} />
	),
}));

import { VaccineOptionalFields } from "@/components/patients/health/VaccineOptionalFields";

const mockForm = { control: {} } as never;

describe("VaccineOptionalFields", () => {
	it("renders Dose label", () => {
		render(<VaccineOptionalFields form={mockForm} />);
		expect(screen.getByText("Dose (opcional)")).toBeInTheDocument();
	});

	it("renders Data label", () => {
		render(<VaccineOptionalFields form={mockForm} />);
		expect(screen.getByText("Data (opcional)")).toBeInTheDocument();
	});

	it("renders Observações label", () => {
		render(<VaccineOptionalFields form={mockForm} />);
		expect(screen.getByText("Observações (opcional)")).toBeInTheDocument();
	});
});
