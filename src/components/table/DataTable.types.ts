import type { ColumnDef, RowData } from "@tanstack/react-table";

export interface DataTableProps<TData extends RowData> {
	// biome-ignore lint/suspicious/noExplicitAny: tanstack table v9 requires any for feature/value types
	columns: ColumnDef<any, TData, any>[];
	data: TData[];
}
