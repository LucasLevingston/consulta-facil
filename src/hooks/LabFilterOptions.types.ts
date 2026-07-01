import type { RADIUS_OPTIONS } from "@/utils/constants/radius-options";

export interface LabFilterOptions {
	availableStates: string[];
	radiusOptions: typeof RADIUS_OPTIONS;
}
