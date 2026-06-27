"use client";

import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { DAYS, type DayKey } from "@/utils/constants/days-of-week";
import { ALL } from "@/utils/constants/filter-sentinels";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import type { ClinicsFiltersProps } from "./ClinicsFilters.types";

export function ClinicsFiltersAdvancedPanel({ hook }: ClinicsFiltersProps) {
	const { filterState: fs, options, actions } = hook;

	function toggleDay(day: DayKey) {
		if (fs.selectedDays.includes(day)) {
			actions.setSelectedDays(fs.selectedDays.filter((d) => d !== day));
		} else {
			actions.setSelectedDays([...fs.selectedDays, day]);
		}
	}

	return (
		<div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
			<div className="flex flex-wrap gap-4">
				<div className="flex-1 min-w-[180px] max-w-xs space-y-1.5">
					<label
						htmlFor="filter-city"
						className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"
					>
						<MapPin className="h-3.5 w-3.5" />
						Cidade
					</label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
						<Input
							id="filter-city"
							placeholder="Ex: São Paulo, Campinas..."
							value={fs.filterCity}
							onChange={(e) => actions.setFilterCity(e.target.value)}
							className="pl-9 h-9 rounded-xl text-sm"
						/>
					</div>
				</div>

				<div className="w-[190px] space-y-1.5">
					<label
						htmlFor="filter-specialty-trigger"
						className="text-xs font-medium text-muted-foreground"
					>
						Especialidade
					</label>
					<Select
						value={fs.filterSpecialty || ALL}
						onValueChange={(v) =>
							actions.setFilterSpecialty(v === ALL ? "" : v)
						}
					>
						<SelectTrigger
							id="filter-specialty-trigger"
							className="h-9 rounded-xl text-sm"
						>
							<SelectValue placeholder="Todas" />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value={ALL}>Todas as especialidades</SelectItem>
							{options.availableSpecialties.map((s) => (
								<SelectItem key={s} value={s}>
									{SPECIALTY_LABELS[s] ?? s}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{options.availableProfessions.length > 0 && (
					<div className="w-[175px] space-y-1.5">
						<label
							htmlFor="filter-profession-trigger"
							className="text-xs font-medium text-muted-foreground"
						>
							Tipo de profissional
						</label>
						<Select
							value={fs.filterProfession || ALL}
							onValueChange={(v) =>
								actions.setFilterProfession(v === ALL ? "" : v)
							}
						>
							<SelectTrigger
								id="filter-profession-trigger"
								className="h-9 rounded-xl text-sm"
							>
								<SelectValue placeholder="Todos" />
							</SelectTrigger>
							<SelectContent className="rounded-xl">
								<SelectItem value={ALL}>Todos os tipos</SelectItem>
								{options.availableProfessions.map((p) => (
									<SelectItem key={p} value={p}>
										{p}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
			</div>

			<div className="space-y-1.5">
				<span className="text-xs font-medium text-muted-foreground">
					Horário de funcionamento
				</span>
				<div className="flex flex-wrap gap-1.5">
					{DAYS.map(({ key, label }) => (
						<button
							key={key}
							type="button"
							onClick={() => toggleDay(key)}
							className={cn(
								"px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer",
								fs.selectedDays.includes(key)
									? "bg-primary text-primary-foreground border-primary"
									: "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
							)}
						>
							{label}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
