"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FilterBadgeProps } from "./FilterBadge.types";

export function FilterBadge({ children, icon, onRemove }: FilterBadgeProps) {
	return (
		<Badge
			variant="secondary"
			className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
		>
			{icon}
			{children}
			<button
				type="button"
				onClick={onRemove}
				className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
			>
				<X className="h-3 w-3" />
			</button>
		</Badge>
	);
}
