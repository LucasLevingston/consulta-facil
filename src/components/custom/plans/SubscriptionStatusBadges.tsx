import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import {
	SUBSCRIPTION_STATUS_COLOR,
	SUBSCRIPTION_STATUS_LABEL,
} from "@/utils/constants/subscription-status";

interface Props {
	status: string;
	isExpiringSoon: boolean;
	daysRemaining: number | null;
}

export function SubscriptionStatusBadges({
	status,
	isExpiringSoon,
	daysRemaining,
}: Props) {
	return (
		<div className="flex flex-wrap gap-2">
			<Badge
				variant="outline"
				className={cn(
					"text-xs font-semibold",
					SUBSCRIPTION_STATUS_COLOR[status] ??
						SUBSCRIPTION_STATUS_COLOR.EXPIRED,
				)}
			>
				{SUBSCRIPTION_STATUS_LABEL[status] ?? status}
			</Badge>
			{isExpiringSoon && daysRemaining !== null && (
				<Badge
					variant="outline"
					className="text-xs font-semibold border-yellow-500/30 bg-yellow-500/10 text-yellow-600"
				>
					Expira em{" "}
					{daysRemaining === 0
						? "hoje"
						: `${daysRemaining} dia${daysRemaining !== 1 ? "s" : ""}`}
				</Badge>
			)}
		</div>
	);
}
