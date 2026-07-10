import type { FilterSelectOption } from "./FilterSelectOption.types";

export interface FilterSelectConfig {
	id: string;
	label: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	options: FilterSelectOption[];
}
