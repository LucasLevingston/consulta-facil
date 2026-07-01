"use client";

import { LayoutList, Loader2, MapIcon, Navigation, X } from "lucide-react";
import DoctorFilters from "@/components/custom/doctor/DoctorFilters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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
			<DoctorFilters />
			<div className="flex items-center gap-2 shrink-0">
				{isNearbyMode ? (
					<div className="flex items-center gap-2">
						<Select
							value={String(radiusKm)}
							onValueChange={(v) => onSetRadiusKm(Number(v))}
						>
							<SelectTrigger className="h-9 w-[100px] rounded-xl text-sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="rounded-xl">
								{radiusOptions.map(({ value, label }) => (
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
							Perto de você
							<button
								type="button"
								onClick={onClearLocation}
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
						onClick={onRequestLocation}
						disabled={locationLoading}
						className="rounded-xl gap-2"
					>
						{locationLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Navigation className="h-4 w-4" />
						)}
						Perto de mim
					</Button>
				)}
				<div className="flex rounded-xl border overflow-hidden">
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
