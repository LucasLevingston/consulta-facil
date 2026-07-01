import { cn } from "@/lib/utils/cn";

interface Props {
	progressPercent: number;
	progressColor: string;
	daysRemaining: number | null;
}

export function SubscriptionProgressBar({
	progressPercent,
	progressColor,
	daysRemaining,
}: Props) {
	return (
		<div className="space-y-1.5">
			<div className="h-1.5 overflow-hidden rounded-full bg-muted">
				<div
					className={cn("h-full rounded-full transition-all", progressColor)}
					style={{ width: `${progressPercent}%` }}
				/>
			</div>
			{daysRemaining !== null && (
				<p className="text-xs text-muted-foreground text-right">
					{daysRemaining} dia{daysRemaining !== 1 ? "s" : ""} restante
					{daysRemaining !== 1 ? "s" : ""}
				</p>
			)}
		</div>
	);
}
