import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
	icon?: ReactNode;
	label: ReactNode;
	onRemove: () => void;
}

export function FilterChip({ icon, label, onRemove }: Props) {
	return (
		<Badge
			variant="secondary"
			className="gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
		>
			{icon}
			{label}
			<button
				type="button"
				onClick={onRemove}
				className="ml-0.5 cursor-pointer rounded-full transition-opacity hover:opacity-70"
			>
				<X className="h-3 w-3" />
			</button>
		</Badge>
	);
}
