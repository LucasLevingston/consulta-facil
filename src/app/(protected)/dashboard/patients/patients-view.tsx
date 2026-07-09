"use client";

import { Search, UserRound } from "lucide-react";
import { Suspense } from "react";
import { CustomPagination } from "@/components/custom/custom-pagination";
import PageHeader from "@/components/custom/page-header";
import { PatientsGrid } from "@/components/patients/PatientsGrid";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePatientsPage } from "@/features/patients";
import { QueryBoundary } from "@/providers/query-boundary";

function PatientsContent() {
	const {
		patients,
		totalPages,
		totalElements,
		page,
		search,
		sort,
		isLoading,
		error,
		isAdmin,
		updateParams,
	} = usePatientsPage();

	return (
		<div className="space-y-6">
			<PageHeader
				title="Pacientes"
				description={
					isAdmin
						? "Todos os pacientes do sistema."
						: "Lista de pacientes com consultas agendadas com você."
				}
				icon={<UserRound className="h-6 w-6" />}
				count={totalElements}
				countLabel="paciente"
			/>

			<QueryBoundary isLoading={isLoading} error={error}>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Buscar por nome..."
							value={search}
							onChange={(e) => updateParams({ q: e.target.value || null })}
							className="pl-9 rounded-xl"
						/>
					</div>

					<Select value={sort} onValueChange={(v) => updateParams({ sort: v })}>
						<SelectTrigger className="w-full rounded-xl sm:w-[180px]">
							<SelectValue placeholder="Ordenar por" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="recent">Consulta mais recente</SelectItem>
							<SelectItem value="name">Nome (A–Z)</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<PatientsGrid patients={patients} />

				<CustomPagination
					currentPage={page}
					totalPages={totalPages}
					onPageChange={(p) => updateParams({ page: String(p) }, false)}
					className="pt-2"
				/>
			</QueryBoundary>
		</div>
	);
}

export function PatientsView() {
	return (
		<Suspense>
			<PatientsContent />
		</Suspense>
	);
}
