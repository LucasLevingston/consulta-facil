"use client";

import { cn } from "@/lib/utils/cn";
import type { StatCardProps } from "./StatCard.types";

const statusStyles: Record<
	string,
	{ bg: string; border: string; text: string; dot: string }
> = {
	CONFIRMED: {
		bg: "bg-green-500/10",
		border: "border-green-500/30",
		text: "text-green-400",
		dot: "bg-green-500",
	},
	PENDING: {
		bg: "bg-yellow-500/10",
		border: "border-yellow-500/30",
		text: "text-yellow-400",
		dot: "bg-yellow-500",
	},
	CANCELED: {
		bg: "bg-red-500/10",
		border: "border-red-500/30",
		text: "text-red-400",
		dot: "bg-red-500",
	},
	COMPLETED: {
		bg: "bg-blue-500/10",
		border: "border-blue-500/30",
		text: "text-blue-400",
		dot: "bg-blue-500",
	},
	ALL: {
		bg: "bg-primary/10",
		border: "border-primary/30",
		text: "text-primary",
		dot: "bg-primary",
	},
};

export const StatCard = ({
	count = 0,
	label,
	type,
	onClick,
	onActive,
}: StatCardProps) => {
	const key = type ?? "ALL";
	const style = statusStyles[key] ?? statusStyles.ALL;

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
				"hover:scale-[1.02] hover:shadow-lg",
				style.bg,
				style.border,
				onActive && "ring-2 ring-primary/50 shadow-md shadow-primary/10",
			)}
		>
			<div className="flex items-center gap-3">
				<span className={cn("h-2.5 w-2.5 rounded-full", style.dot)} />
				<span className={cn("text-3xl font-bold tracking-tight", style.text)}>
					{count}
				</span>
			</div>
			<p className="text-sm font-medium text-muted-foreground">{label}</p>
		</button>
	);
};
