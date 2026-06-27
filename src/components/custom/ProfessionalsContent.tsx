"use client";

import {
	LayoutList,
	Loader2,
	MapIcon,
	Navigation,
	Users,
	X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { CustomPagination } from "@/components/custom/custom-pagination";
import DoctorFilters from "@/components/custom/doctor/DoctorFilters";
import DoctorsList from "@/components/custom/doctor/DoctorsClientList";
import { DoctorsMap } from "@/components/custom/map/DoctorsMap";
import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useProfessionalsFilters } from "@/hooks/use-professionals-filters";
import { QueryBoundary } from "@/providers/query-boundary";

export default function ProfessionalsContent() {
	const searchParams = useSearchParams();
	const days = searchParams.get("days")?.split(",").filter(Boolean) ?? [];

	const {
		viewMode,
		location: loc,
		actions,
		displayed,
		professionalsWithLocation,
		totalElements,
		totalPages,
		currentPage,
		isNearbyMode,
		isLoading,
		error,
		radiusOptions,
	} = useProfessionalsFilters();

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<PageHeader
				title="Profissionais"
				description="Encontre especialistas cadastrados na plataforma."
				icon={<Users className="h-6 w-6" />}
				count={totalElements}
				countLabel="profissional"
			/>

			<div className="space-y-4">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<DoctorFilters />

					<div className="flex items-center gap-2 shrink-0">
						{isNearbyMode ? (
							<div className="flex items-center gap-2">
								<Select
									value={String(loc.radiusKm)}
									onValueChange={(v) => actions.setRadiusKm(Number(v))}
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
								variant={viewMode === "list" ? "default" : "ghost"}
								size="sm"
								onClick={() => actions.setViewMode("list")}
								className="rounded-none"
							>
								<LayoutList className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "map" ? "default" : "ghost"}
								size="sm"
								onClick={() => actions.setViewMode("map")}
								className="rounded-none"
							>
								<MapIcon className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>

				{days.length > 0 && !isNearbyMode && (
					<p className="text-xs text-muted-foreground">
						Filtro por dia de atendimento exige que o profissional esteja em
						modo &ldquo;Perto de mim&rdquo; para funcionar completamente.
					</p>
				)}

				{viewMode === "map" ? (
					<div className="space-y-3">
						{professionalsWithLocation.length === 0 && (
							<p className="text-sm text-muted-foreground">
								Nenhum profissional com localização cadastrada encontrado.
							</p>
						)}
						<DoctorsMap
							doctors={displayed}
							center={
								loc.userLocation
									? [loc.userLocation.lat, loc.userLocation.lng]
									: undefined
							}
							zoom={loc.userLocation ? 10 : 5}
							className="h-[520px] w-full"
						/>
					</div>
				) : (
					<>
						<DoctorsList doctors={displayed} />
						{!isNearbyMode && (
							<CustomPagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={actions.goToPage}
								className="pt-2"
							/>
						)}
					</>
				)}
			</div>
		</QueryBoundary>
	);
}
