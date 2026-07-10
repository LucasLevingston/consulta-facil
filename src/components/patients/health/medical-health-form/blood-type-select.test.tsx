import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { fieldOnChange } = vi.hoisted(() => ({ fieldOnChange: vi.fn() }));

vi.mock("@/components/ui/form", () => ({
	FormField: ({
		render,
	}: {
		render: (arg: {
			field: { value: unknown; onChange: typeof fieldOnChange; name: string };
		}) => React.ReactNode;
	}) =>
		render({
			field: { value: null, onChange: fieldOnChange, name: "bloodType" },
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
		onValueChange: (v: string) => void;
	}) => (
		<div data-testid="select" data-value={value}>
			{children}
			<button
				type="button"
				data-testid="pick-a-positive"
				onClick={() => onValueChange("A_POSITIVE")}
			>
				selecionar-a-positive
			</button>
			<button
				type="button"
				data-testid="pick-none"
				onClick={() => onValueChange("__none__")}
			>
				selecionar-none
			</button>
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

import { BloodTypeSelect } from "./BloodTypeSelect";

beforeEach(() => {
	fieldOnChange.mockClear();
});

describe("BloodTypeSelect", () => {
	it("renderiza a opção 'Não informado'", () => {
		render(<BloodTypeSelect control={{} as never} />);
		expect(screen.getByText("Não informado")).toBeInTheDocument();
	});

	it("renderiza todas as opções de tipo sanguíneo", () => {
		render(<BloodTypeSelect control={{} as never} />);
		expect(screen.getByText("A+")).toBeInTheDocument();
		expect(screen.getByText("B-")).toBeInTheDocument();
		expect(screen.getByText("AB+")).toBeInTheDocument();
		expect(screen.getByText("O-")).toBeInTheDocument();
	});

	it("renderiza o label 'Tipo sanguíneo'", () => {
		render(<BloodTypeSelect control={{} as never} />);
		expect(screen.getByText("Tipo sanguíneo")).toBeInTheDocument();
	});

	it("chama field.onChange com o valor selecionado", async () => {
		render(<BloodTypeSelect control={{} as never} />);
		await userEvent.click(screen.getByTestId("pick-a-positive"));
		expect(fieldOnChange).toHaveBeenCalledWith("A_POSITIVE");
	});

	it("converte o valor '__none__' para null ao chamar onChange", async () => {
		render(<BloodTypeSelect control={{} as never} />);
		await userEvent.click(screen.getByTestId("pick-none"));
		expect(fieldOnChange).toHaveBeenCalledWith(null);
	});
});
