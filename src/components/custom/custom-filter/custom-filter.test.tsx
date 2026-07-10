import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Stub simples do Select (Radix) seguindo o padrão usado em outros testes do repo
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
			<button
				type="button"
				data-testid="select-change"
				onClick={() => onValueChange?.("opcao-2")}
			>
				mudar
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

import { CustomFilterControls } from "./CustomFilterControls";
import { CustomFilter } from "./custom-filter";

describe("CustomFilterControls", () => {
	it("renderiza o campo de busca com o valor informado", () => {
		render(
			<CustomFilterControls
				search={{ value: "abc", onChange: vi.fn() }}
				selects={[]}
			/>,
		);
		expect(screen.getByPlaceholderText("Buscar...")).toHaveValue("abc");
	});

	it("chama onChange da busca ao digitar", async () => {
		const onChange = vi.fn();
		render(
			<CustomFilterControls search={{ value: "", onChange }} selects={[]} />,
		);
		await userEvent.type(screen.getByPlaceholderText("Buscar..."), "a");
		expect(onChange).toHaveBeenCalledWith("a");
	});

	it("limpa a busca ao clicar no botão de limpar", async () => {
		const onChange = vi.fn();
		render(
			<CustomFilterControls search={{ value: "abc", onChange }} selects={[]} />,
		);
		await userEvent.click(screen.getByLabelText("Limpar busca"));
		expect(onChange).toHaveBeenCalledWith("");
	});

	it("renderiza os selects com as opções informadas", () => {
		render(
			<CustomFilterControls
				selects={[
					{
						id: "status",
						label: "Status",
						value: "",
						onChange: vi.fn(),
						options: [
							{ label: "Ativo", value: "ativo" },
							{ label: "Inativo", value: "inativo" },
						],
					},
				]}
			/>,
		);
		expect(screen.getByText("Ativo")).toBeInTheDocument();
		expect(screen.getByText("Inativo")).toBeInTheDocument();
	});

	it("chama onChange do select ao mudar de valor", async () => {
		const onChange = vi.fn();
		render(
			<CustomFilterControls
				selects={[
					{
						id: "status",
						label: "Status",
						value: "",
						onChange,
						options: [{ label: "Ativo", value: "opcao-2" }],
					},
				]}
			/>,
		);
		await userEvent.click(screen.getByTestId("select-change"));
		expect(onChange).toHaveBeenCalledWith("opcao-2");
	});
});

describe("CustomFilter", () => {
	it("renderiza a busca e os switches", () => {
		render(
			<CustomFilter
				search={{ value: "", onChange: vi.fn() }}
				switches={[
					{
						id: "sw1",
						label: "Somente ativos",
						checked: false,
						onChange: vi.fn(),
					},
				]}
			/>,
		);
		expect(screen.getByPlaceholderText("Buscar...")).toBeInTheDocument();
		expect(screen.getByText("Somente ativos")).toBeInTheDocument();
	});

	it("chama onChange do switch ao alternar", async () => {
		const onChange = vi.fn();
		render(
			<CustomFilter
				switches={[
					{ id: "sw1", label: "Somente ativos", checked: false, onChange },
				]}
			/>,
		);
		await userEvent.click(screen.getByRole("switch"));
		expect(onChange).toHaveBeenCalledWith(true);
	});

	it("mostra a contagem de filtros ativos e o botão de limpar quando onReset é informado", async () => {
		const onReset = vi.fn();
		render(
			<CustomFilter
				search={{ value: "termo", onChange: vi.fn() }}
				onReset={onReset}
			/>,
		);
		expect(screen.getByText("1")).toBeInTheDocument();
		await userEvent.click(screen.getByRole("button", { name: /^Limpar\d/ }));
		expect(onReset).toHaveBeenCalledTimes(1);
	});

	it("mostra o texto de filtros ativos sem botão de limpar quando onReset não é informado", () => {
		render(
			<CustomFilter
				search={{ value: "termo", onChange: vi.fn() }}
				switches={[
					{ id: "sw1", label: "Ativo", checked: true, onChange: vi.fn() },
				]}
			/>,
		);
		expect(screen.getByText(/2 filtros ativos/)).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /^Limpar\d/ }),
		).not.toBeInTheDocument();
	});

	it("não mostra indicador de filtros quando nenhum filtro está ativo", () => {
		render(<CustomFilter search={{ value: "", onChange: vi.fn() }} />);
		expect(screen.queryByText(/filtro/i)).not.toBeInTheDocument();
	});
});
