"use client";

import { ChevronsUpDown, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { getInitials } from "@/lib/utils/get-initials";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import type { DoctorComboboxTriggerProps } from "./DoctorComboboxTrigger.types";

export function DoctorComboboxTrigger({
	selected,
	open,
	disabled,
	hasValue,
}: DoctorComboboxTriggerProps) {
	return (
		<Button
			variant="outline"
			role="combobox"
			aria-expanded={open}
			disabled={disabled}
			className={cn(
				"w-full justify-between rounded-xl border-border h-auto py-3 px-4",
				!hasValue && "text-muted-foreground",
			)}
		>
			{selected ? (
				<div className="flex items-center gap-3">
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
							{getInitials(selected.name)}
						</AvatarFallback>
					</Avatar>
					<div className="text-left">
						<p className="text-sm font-medium">{selected.name}</p>
						<p className="text-xs text-muted-foreground">
							{SPECIALTY_LABELS[selected.specialty] ?? selected.specialty}
						</p>
					</div>
				</div>
			) : (
				<div className="flex items-center gap-2">
					<Search className="h-4 w-4" />
					<span>Buscar profissional...</span>
				</div>
			)}
			<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	);
}
