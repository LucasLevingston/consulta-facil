"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ALL } from "@/utils/constants/filter-sentinels";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

interface Props {
	filterSpecialty: string;
	filterProfession: string;
	availableSpecialties: string[];
	availableProfessions: string[];
	onSpecialtyChange: (v: string) => void;
	onProfessionChange: (v: string) => void;
}

export function ClinicsFiltersSelectsRow({
	filterSpecialty,
	filterProfession,
	availableSpecialties,
	availableProfessions,
	onSpecialtyChange,
	onProfessionChange,
}: Props) {
	return (
		<>
			<div className="w-[190px] space-y-1.5">
				<label
					htmlFor="filter-specialty-trigger"
					className="text-xs font-medium text-muted-foreground"
				>
					Especialidade
				</label>
				<Select
					value={filterSpecialty || ALL}
					onValueChange={(v) => onSpecialtyChange(v === ALL ? "" : v)}
				>
					<SelectTrigger
						id="filter-specialty-trigger"
						className="h-9 rounded-xl text-sm"
					>
						<SelectValue placeholder="Todas" />
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						<SelectItem value={ALL}>Todas as especialidades</SelectItem>
						{availableSpecialties.map((s) => (
							<SelectItem key={s} value={s}>
								{SPECIALTY_LABELS[s] ?? s}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			{availableProfessions.length > 0 && (
				<div className="w-[175px] space-y-1.5">
					<label
						htmlFor="filter-profession-trigger"
						className="text-xs font-medium text-muted-foreground"
					>
						Tipo de profissional
					</label>
					<Select
						value={filterProfession || ALL}
						onValueChange={(v) => onProfessionChange(v === ALL ? "" : v)}
					>
						<SelectTrigger
							id="filter-profession-trigger"
							className="h-9 rounded-xl text-sm"
						>
							<SelectValue placeholder="Todos" />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value={ALL}>Todos os tipos</SelectItem>
							{availableProfessions.map((p) => (
								<SelectItem key={p} value={p}>
									{p}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}
		</>
	);
}
