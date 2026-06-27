import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FeatureBadgeProps } from "./FeatureBadge.types";

export function FeatureBadge({ value }: FeatureBadgeProps) {
	if (value === "true") {
		return (
			<span className="flex items-center gap-1 text-emerald-600 text-sm">
				<CheckCircle className="h-4 w-4" />
				Incluído
			</span>
		);
	}
	if (value === "false") {
		return (
			<span className="flex items-center gap-1 text-muted-foreground text-sm">
				<XCircle className="h-4 w-4" />
				Não incluído
			</span>
		);
	}
	return <Badge variant="secondary">{value}</Badge>;
}
