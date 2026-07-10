"use client";

import { Loader2, Navigation, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { UseLabFiltersReturn } from "@/features/exams";

interface Props {
	hook: UseLabFiltersReturn;
}

export function LabFiltersLocationControl({ hook }: Props) {
	const { location: loc, options, derived, actions } = hook;
	return (
		<div className="ml-auto flex items-center gap-2">
			{derived.isNearbyMode ? (
				<div className="flex items-center gap-2">
					<Select
						value={String(loc.radiusKm)}
						onValueChange={(v) => actions.setRadiusKm(Number(v))}
					>
						<SelectTrigger className="h-9 w-[100px] rounded-xl text-sm">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							{options.radiusOptions.map(({ value, label }) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Badge
						variant="secondary"
						className="gap-1.5 px-3 py-1.5 rounded-full text-sm"
					>
						<Navigation className="h-3.5 w-3.5 text-primary" />
						Perto de você ({loc.radiusKm}km)
						<button
							type="button"
							aria-label="Remover localização"
							onClick={actions.clearLocation}
							className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					</Badge>
				</div>
			) : (
				<Button
					variant="outline"
					size="sm"
					onClick={actions.requestLocation}
					disabled={loc.locationLoading}
					className="rounded-xl gap-2"
				>
					{loc.locationLoading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Navigation className="h-4 w-4" />
					)}
					Perto de mim
				</Button>
			)}
		</div>
	);
}
