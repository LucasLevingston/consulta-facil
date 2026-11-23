"use client";

import {
	coreFeatures,
	createCoreRowModel,
	createPaginatedRowModel,
	flexRender,
	type RowData,
	stockFeatures,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { DataTableProps } from "./DataTable.types";

const _features = tableFeatures({
	...coreFeatures,
	...stockFeatures,
	coreRowModel: createCoreRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
});

export function DataTable<TData extends RowData>({
	columns,
	data,
}: DataTableProps<TData>) {
	const table = useTable({
		features: _features,
		data,
		// biome-ignore lint/suspicious/noExplicitAny: v9 column definitions use any for feature types
		columns: columns as any,
	});

	return (
		<div className="data-table">
			<Table className="shad-table">
				<TableHeader className="bg-dark-200">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="shad-table-row-header">
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								className="shad-table-row"
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								Sem resultados.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
