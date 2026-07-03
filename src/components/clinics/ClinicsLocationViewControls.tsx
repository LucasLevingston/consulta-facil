"use client";

import { LayoutList, Loader2, MapIcon, Navigation, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ClinicsFiltersProps } from "./ClinicsFilters.types";

export function ClinicsLocationViewControls({ hook }: ClinicsFiltersProps) {
	const { filterState: fs, location: loc, options, derived, actions } = hook;
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
							onClick={actions.clearLocation}
							className="ml-0.5 hover:opacity-70 transition-opacity"
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
			<div className="flex rounded-xl border overflow-hidden">
				<Button
					variant={fs.viewMode === "list" ? "default" : "ghost"}
					size="sm"
					onClick={() => actions.setViewMode("list")}
					className="rounded-none"
				>
					<LayoutList className="h-4 w-4" />
				</Button>
				<Button
					variant={fs.viewMode === "map" ? "default" : "ghost"}
					size="sm"
					onClick={() => actions.setViewMode("map")}
					className="rounded-none"
				>
					<MapIcon className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
