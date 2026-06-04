"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export function SummaryCard({
	icon,
	label,
	value,
	sub,
	colorClass,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	sub?: string;
	colorClass: string;
}) {
	return (
		<Card className="border-border bg-card">
			<CardContent className="flex items-center gap-4 p-5">
				<div
					className={cn(
						"flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
						colorClass,
					)}
				>
					{icon}
				</div>
				<div>
					<p className="text-xs text-muted-foreground">{label}</p>
					<p className="text-xl font-bold text-foreground">{value}</p>
					{sub && <p className="text-xs text-muted-foreground">{sub}</p>}
				</div>
			</CardContent>
		</Card>
	);
}
