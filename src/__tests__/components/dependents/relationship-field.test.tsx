import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const { fieldOnChange } = vi.hoisted(() => ({ fieldOnChange: vi.fn() }));

vi.mock("@/components/ui/form", () => ({
	FormField: ({
		render,
	}: {
		render: (arg: { field: object }) => React.ReactNode;
	}) =>
		render({
			field: { value: "", onChange: fieldOnChange, name: "relationship" },
		}),
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
vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		value,
		onValueChange,
	}: {
		children: React.ReactNode;
		value?: string;
		onValueChange?: (v: string) => void;
	}) => (
		<div data-testid="select" data-value={value}>
			<button type="button" onClick={() => onValueChange?.("SPOUSE")}>
				escolher-conjuge
			</button>
			{children}
		</div>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectValue: ({ placeholder }: { placeholder?: string }) => (
		<span>{placeholder}</span>
	),
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

import { RelationshipField } from "@/components/dependents/RelationshipField";

describe("RelationshipField", () => {
	it("renderiza o label 'Relação *'", () => {
		render(<RelationshipField control={{} as never} />);
		expect(screen.getByText("Relação *")).toBeInTheDocument();
	});

	it("renderiza todas as opções de parentesco", () => {
		render(<RelationshipField control={{} as never} />);
		expect(screen.getByText("Filho(a)")).toBeInTheDocument();
		expect(screen.getByText("Cônjuge")).toBeInTheDocument();
		expect(screen.getByText("Irmão(ã)")).toBeInTheDocument();
		expect(screen.getByText("Pai/Mãe")).toBeInTheDocument();
		expect(screen.getByText("Outro")).toBeInTheDocument();
	});

	it("propaga a seleção de parentesco através do onChange do campo", async () => {
		const user = userEvent.setup();
		render(<RelationshipField control={{} as never} />);
		await user.click(screen.getByText("escolher-conjuge"));
		expect(fieldOnChange).toHaveBeenCalledWith("SPOUSE");
	});
});
