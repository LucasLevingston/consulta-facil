export function getPageNumbers(
	current: number,
	total: number,
): (number | "...")[] {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i);

	const pages: (number | "...")[] = [0];
	const start = Math.max(1, current - 2);
	const end = Math.min(total - 2, current + 2);

	const leftGap = start - 1;
	if (leftGap === 1) pages.push(1);
	else if (leftGap > 1) pages.push("...");

	for (let i = start; i <= end; i++) pages.push(i);

	const rightGap = total - 1 - end - 1;
	if (rightGap === 1) pages.push(end + 1);
	else if (rightGap > 1) pages.push("...");

	pages.push(total - 1);

	return pages;
}
