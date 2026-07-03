"use client";

import { Check } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils/cn";
import { getInitials } from "@/lib/utils/get-initials";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import type { ProfessionalOptionProps } from "./ProfessionalOption.types";

export function ProfessionalOption({
	professional,
	isSelected,
	onSelect,
}: ProfessionalOptionProps) {
	return (
		<CommandItem
			value={`${professional.name} ${professional.specialty}`}
			onSelect={onSelect}
		>
			<div className="flex items-center gap-3 flex-1">
				<Avatar className="h-8 w-8 rounded-lg">
					<AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
						{getInitials(professional.name)}
					</AvatarFallback>
				</Avatar>
				<div>
					<p className="text-sm font-medium">{professional.name}</p>
					<p className="text-xs text-muted-foreground">
						{SPECIALTY_LABELS[professional.specialty] ?? professional.specialty}
					</p>
				</div>
			</div>
			<Check
				className={cn(
					"ml-auto h-4 w-4",
					isSelected ? "opacity-100" : "opacity-0",
				)}
			/>
		</CommandItem>
	);
}
