export interface FilterSearchConfig {
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
}

export interface FilterSelectOption {
	label: string;
	value: string;
}

export interface FilterSelectConfig {
	id: string;
	label: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	options: FilterSelectOption[];
}

export interface FilterSwitchConfig {
	id: string;
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

export interface CustomFilterProps {
	search?: FilterSearchConfig;
	selects?: FilterSelectConfig[];
	switches?: FilterSwitchConfig[];
	onReset?: () => void;
	className?: string;
}
