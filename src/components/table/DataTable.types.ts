import type { ColumnDef } from "@tanstack/react-table";

export interface DataTableProps<TData> {
	// biome-ignore lint/suspicious/noExplicitAny: tanstack table requires any for column value type
	columns: ColumnDef<TData, any>[];
	data: TData[];
}
