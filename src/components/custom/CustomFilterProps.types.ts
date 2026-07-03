import type { FilterSearchConfig } from "./FilterSearchConfig.types";
import type { FilterSelectConfig } from "./FilterSelectConfig.types";
import type { FilterSwitchConfig } from "./FilterSwitchConfig.types";

export interface CustomFilterProps {
	search?: FilterSearchConfig;
	selects?: FilterSelectConfig[];
	switches?: FilterSwitchConfig[];
	onReset?: () => void;
	className?: string;
}
