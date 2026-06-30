"use client";

import { formatBRL } from "@/utils/format-brl";
import type { MonthBarProps } from "./MonthBar.types";

export function MonthBar({ label, value, max }: MonthBarProps) {
	const pct = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 4;
	return (
		<div className="flex flex-col items-center gap-1">
			<span className="text-xs text-muted-foreground">{formatBRL(value)}</span>
			<div className="flex h-32 w-full items-end">
				<div
					className="w-full rounded-t-lg bg-primary/80 transition-all"
					style={{ height: `${pct}%` }}
				/>
			</div>
			<span className="text-xs text-muted-foreground">{label}</span>
		</div>
	);
}
