import type { Breakdown } from "@/features/analytics";

/** Adds each entry's share of the total (0-100, one decimal) so the charts can show it. */
export function toBreakdown(
	entries: { label: string; count: number }[],
): Breakdown[] {
	const total = entries.reduce((sum, entry) => sum + entry.count, 0);
	return entries.map((entry) => ({
		...entry,
		percentage: total === 0 ? 0 : Math.round((entry.count / total) * 1000) / 10,
	}));
}
