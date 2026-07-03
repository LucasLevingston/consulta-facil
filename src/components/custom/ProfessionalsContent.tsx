"use client";

import { Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/custom/page-header";
import { useProfessionalsFilters } from "@/features/professionals";
import { QueryBoundary } from "@/providers/query-boundary";
import { ProfessionalsToolbar } from "./ProfessionalsToolbar";
import { ProfessionalsViewContent } from "./ProfessionalsViewContent";

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
				<ProfessionalsToolbar
					viewMode={viewMode}
					isNearbyMode={isNearbyMode}
					radiusKm={loc.radiusKm}
					locationLoading={loc.locationLoading}
					radiusOptions={radiusOptions}
					onSetRadiusKm={actions.setRadiusKm}
					onClearLocation={actions.clearLocation}
					onRequestLocation={actions.requestLocation}
					onSetViewMode={actions.setViewMode}
				/>
				{days.length > 0 && !isNearbyMode && (
					<p className="text-xs text-muted-foreground">
						Filtro por dia de atendimento exige que o profissional esteja em
						modo &ldquo;Perto de mim&rdquo; para funcionar completamente.
					</p>
				)}
				<ProfessionalsViewContent
					viewMode={viewMode}
					displayed={displayed}
					professionalsWithLocation={professionalsWithLocation}
					isNearbyMode={isNearbyMode}
					currentPage={currentPage}
					totalPages={totalPages}
					userLocation={loc.userLocation}
					onPageChange={actions.goToPage}
				/>
			</div>
		</QueryBoundary>
	);
}
