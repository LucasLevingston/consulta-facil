"use client";

import { SlidersHorizontal } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ALL } from "@/utils/constants/filter-sentinels";
import { professions } from "@/utils/constants/profession-specialties";
import type { useProfessionalFilters } from "./useProfessionalFilters";

interface Props {
	filters: ReturnType<typeof useProfessionalFilters>;
}

export function ProfessionalFiltersSelects({ filters }: Props) {
	return (
		<>
			<Select
				value={filters.profession || ALL}
				onValueChange={filters.handleProfessionChange}
			>
				<SelectTrigger className="w-[175px] rounded-xl">
					<div className="flex items-center gap-2">
						<SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
						<SelectValue placeholder="Profissão" />
					</div>
				</SelectTrigger>
				<SelectContent className="rounded-xl">
					<SelectItem value={ALL}>Todas as profissões</SelectItem>
					{professions.map((p) => (
						<SelectItem key={p} value={p}>
							{p}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				value={filters.specialty || ALL}
				onValueChange={(v) => filters.setSpecialty(v === ALL ? "" : v)}
			>
				<SelectTrigger className="w-[200px] rounded-xl">
					<div className="flex items-center gap-2">
						<SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
						<SelectValue placeholder="Especialidade" />
					</div>
				</SelectTrigger>
				<SelectContent className="rounded-xl">
					<SelectItem value={ALL}>Todas as especialidades</SelectItem>
					{filters.availableSpecialties.map((s) => (
						<SelectItem key={s} value={s}>
							{s}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</>
	);
}
