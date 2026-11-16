import type { MonthlyRevenue, TimeSeries } from "@/features/analytics";

/** "2026-04" → "04/2026", the month label format used by the other analytics charts. */
export function toRevenueSeries(byMonth: MonthlyRevenue[]): TimeSeries[] {
	return byMonth.map(({ month, amount }) => {
		const [year, monthNumber] = month.split("-");
		return { label: `${monthNumber}/${year}`, value: amount };
	});
}
