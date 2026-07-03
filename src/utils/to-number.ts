export function toNumber(v: unknown): number | null {
	if (v === null || v === undefined || v === "") return null;
	const n = Number(v);
	return Number.isNaN(n) ? null : n;
}
