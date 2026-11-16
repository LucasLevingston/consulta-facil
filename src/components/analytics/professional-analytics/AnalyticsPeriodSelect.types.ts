import type { AnalyticsPeriod } from "@/features/analytics";

export interface AnalyticsPeriodSelectProps {
	value: AnalyticsPeriod;
	onChange: (period: AnalyticsPeriod) => void;
	disabled?: boolean;
}
