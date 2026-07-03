import type { ElementType } from "react";
import { cn } from "@/lib/utils/cn";

interface Props {
	label: string;
	expiresAtFormatted: string | null;
	isActive: boolean;
	isExpiringSoon: boolean;
	StatusIcon: ElementType;
}

export function SubscriptionBannerInfo({
	label,
	expiresAtFormatted,
	isActive,
	isExpiringSoon,
	StatusIcon,
}: Props) {
	return (
		<div className="flex items-start gap-3">
			<div
				className={cn(
					"mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
					isActive
						? isExpiringSoon
							? "bg-yellow-500/10"
							: "bg-green-500/10"
						: "bg-muted",
				)}
			>
				<StatusIcon
					className={cn(
						"h-4 w-4",
						isActive
							? isExpiringSoon
								? "text-yellow-500"
								: "text-green-500"
							: "text-muted-foreground",
					)}
				/>
			</div>
			<div>
				<p className="text-xs text-muted-foreground">Plano atual</p>
				<p className="font-semibold text-foreground">{label}</p>
				{expiresAtFormatted && (
					<p className="mt-0.5 text-xs text-muted-foreground">
						{isActive ? "Válido até" : "Expirou em"} {expiresAtFormatted}
					</p>
				)}
			</div>
		</div>
	);
}
