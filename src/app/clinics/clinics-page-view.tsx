"use client";

import { Building2 } from "lucide-react";
import { ClinicsFilters } from "@/components/clinics/ClinicsFilters";
import ClinicCard from "@/components/custom/clinic/ClinicCard";
import { ClinicsMap } from "@/components/custom/map/ClinicsMap";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { Button } from "@/components/ui/button";
import { useClinicsFilters } from "@/features/clinics";
import { QueryBoundary } from "@/providers/query-boundary";

function ClinicsPageContent() {
	const clinics = useClinicsFilters();
	const {
		filterState: fs,
		location: loc,
		derived,
		actions,
		displayed,
		isLoading,
		error,
	} = clinics;

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<PageHeader
				title="Clínicas"
				description="Encontre clínicas e centros médicos cadastrados na plataforma."
				icon={<Building2 className="h-6 w-6" />}
				count={displayed.length}
				countLabel="clínica"
			/>

			<ClinicsFilters hook={clinics} />

			{fs.viewMode === "map" ? (
				<div className="space-y-3">
					{displayed.filter((c) => c.latitude != null).length === 0 && (
						<p className="text-sm text-muted-foreground">
							Nenhuma clínica com localização encontrada para os filtros
							aplicados.
						</p>
					)}
					<ClinicsMap
						clinics={displayed}
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
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{displayed.length === 0 && (
						<div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
								<Building2 className="h-6 w-6 text-muted-foreground" />
							</div>
							<h3 className="mt-4 text-sm font-semibold">
								Nenhuma clínica encontrada
							</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Tente ajustar os filtros ou buscar por outro termo.
							</p>
							{derived.totalActive > 0 && (
								<Button
									variant="outline"
									size="sm"
									className="mt-4"
									onClick={actions.clearFilters}
								>
									Limpar filtros
								</Button>
							)}
						</div>
					)}
					{displayed.map((clinic) => (
						<ClinicCard key={clinic.id} clinic={clinic} />
					))}
				</div>
			)}
		</QueryBoundary>
	);
}

export function ClinicsPageView() {
	return (
		<SuspenseBoundary>
			<ClinicsPageContent />
		</SuspenseBoundary>
	);
}
