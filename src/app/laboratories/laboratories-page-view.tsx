"use client";

import { FlaskConical } from "lucide-react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { LabCard } from "@/components/laboratories/lab-card";
import { LabFilters } from "@/components/laboratories/lab-filters";
import { Button } from "@/components/ui/button";
import { QueryBoundary } from "@/providers/query-boundary";
import { useLabFilters } from "./use-lab-filters";

function LaboratoriesPageContent() {
	const searchParams = useSearchParams();
	const examRequestId = searchParams.get("examId");

	const labs = useLabFilters();
	const { derived, actions, displayed, isLoading, error } = labs;

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<PageHeader
				title="Laboratórios de Exames"
				description={
					examRequestId
						? "Selecione um laboratório para agendar seu exame."
						: "Encontre laboratórios para realizar seus exames."
				}
				icon={<FlaskConical className="h-6 w-6" />}
				count={displayed.length}
				countLabel="laboratório"
			/>

			{examRequestId && (
				<div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 mb-1">
					<FlaskConical className="h-4 w-4 text-primary shrink-0" />
					<p className="text-sm text-primary">
						Escolha um laboratório e clique em <strong>Agendar aqui</strong>{" "}
						para marcar seu exame.
					</p>
				</div>
			)}

			<LabFilters hook={labs} />

			{displayed.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
						<FlaskConical className="h-6 w-6 text-muted-foreground" />
					</div>
					<h3 className="mt-4 text-sm font-semibold">
						Nenhum laboratório encontrado
					</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						Tente ajustar os filtros ou buscar por outro exame.
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
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{displayed.map((lab) => (
						<LabCard key={lab.id} lab={lab} examRequestId={examRequestId} />
					))}
				</div>
			)}
		</QueryBoundary>
	);
}

export function LaboratoriesPageView() {
	return (
		<SuspenseBoundary>
			<LaboratoriesPageContent />
		</SuspenseBoundary>
	);
}
