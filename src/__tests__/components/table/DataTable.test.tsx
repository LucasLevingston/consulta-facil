import type { ColumnDef } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable } from "@/components/table/DataTable";

type Row = { id: string; name: string; age: number };

const columns: ColumnDef<Row, unknown>[] = [
	{ accessorKey: "name", header: "Nome" },
	{ accessorKey: "age", header: "Idade" },
];

const data: Row[] = [
	{ id: "1", name: "Ana", age: 30 },
	{ id: "2", name: "Bruno", age: 42 },
];

describe("DataTable", () => {
	it("renderiza os cabeçalhos das colunas informadas", () => {
		render(<DataTable columns={columns} data={data} />);
		expect(screen.getByText("Nome")).toBeInTheDocument();
		expect(screen.getByText("Idade")).toBeInTheDocument();
	});

	it("renderiza uma linha para cada item de dados", () => {
		render(<DataTable columns={columns} data={data} />);
		expect(screen.getByText("Ana")).toBeInTheDocument();
		expect(screen.getByText("Bruno")).toBeInTheDocument();
		expect(screen.getByText("30")).toBeInTheDocument();
		expect(screen.getByText("42")).toBeInTheDocument();
	});

	it("exibe mensagem de 'Sem resultados' quando a lista de dados está vazia", () => {
		render(<DataTable columns={columns} data={[]} />);
		expect(screen.getByText("Sem resultados.")).toBeInTheDocument();
	});

	it("a célula de 'Sem resultados' ocupa o número total de colunas", () => {
		render(<DataTable columns={columns} data={[]} />);
		const cell = screen.getByText("Sem resultados.");
		expect(cell).toHaveAttribute("colspan", String(columns.length));
	});
});
