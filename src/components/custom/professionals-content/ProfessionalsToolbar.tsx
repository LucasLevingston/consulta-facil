"use client";

import { LayoutList, MapIcon } from "lucide-react";
import ProfessionalFilters from "@/components/custom/professional/ProfessionalFilters";
import { Button } from "@/components/ui/button";
import { ProfessionalsNearbyControl } from "./ProfessionalsNearbyControl";

interface Props {
	viewMode: "list" | "map";
	isNearbyMode: boolean;
	radiusKm: number;
	locationLoading: boolean;
	radiusOptions: ReadonlyArray<{ value: string; label: string }>;
	onSetRadiusKm: (v: number) => void;
	onClearLocation: () => void;
	onRequestLocation: () => void;
	onSetViewMode: (mode: "list" | "map") => void;
}

export function ProfessionalsToolbar({
	viewMode,
	isNearbyMode,
	radiusKm,
	locationLoading,
	radiusOptions,
	onSetRadiusKm,
	onClearLocation,
	onRequestLocation,
	onSetViewMode,
}: Props) {
	return (
		<div className="flex flex-wrap items-start justify-between gap-3">
			<ProfessionalFilters />
			<div className="flex shrink-0 items-center gap-2">
				<ProfessionalsNearbyControl
					isNearbyMode={isNearbyMode}
					radiusKm={radiusKm}
					locationLoading={locationLoading}
					radiusOptions={radiusOptions}
					onSetRadiusKm={onSetRadiusKm}
					onClearLocation={onClearLocation}
					onRequestLocation={onRequestLocation}
				/>
				<div className="flex overflow-hidden rounded-xl border">
					<Button
						variant={viewMode === "list" ? "default" : "ghost"}
						size="sm"
						onClick={() => onSetViewMode("list")}
						className="rounded-none"
					>
						<LayoutList className="h-4 w-4" />
					</Button>
					<Button
						variant={viewMode === "map" ? "default" : "ghost"}
						size="sm"
						onClick={() => onSetViewMode("map")}
						className="rounded-none"
					>
						<MapIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
