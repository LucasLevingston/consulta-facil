"use client";

import { MapPin, Search, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { BRAZILIAN_STATES } from "@/utils/constants/brazilian-states";
import { DAYS } from "@/utils/constants/days-of-week";
import { ALL } from "@/utils/constants/filter-sentinels";
import type { useDoctorFilters } from "./useDoctorFilters";

interface Props {
	filters: ReturnType<typeof useDoctorFilters>;
}

export function DoctorFiltersAdvanced({ filters }: Props) {
	return (
		<div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
			<div className="flex flex-wrap gap-4">
				<div className="flex-1 min-w-[200px] max-w-xs space-y-1.5">
					<label
						htmlFor="filter-service"
						className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"
					>
						<Stethoscope className="h-3.5 w-3.5" />
						Procedimento / Serviço
					</label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
						<Input
							id="filter-service"
							placeholder="Ex: Botox, Limpeza de pele..."
							value={filters.serviceTitle}
							onChange={(e) => filters.setServiceTitle(e.target.value)}
							className="pl-9 h-9 rounded-xl text-sm"
						/>
					</div>
				</div>
				<div className="w-[155px] space-y-1.5">
					<label
						htmlFor="filter-state-trigger"
						className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"
					>
						<MapPin className="h-3.5 w-3.5" />
						Estado
					</label>
					<Select
						value={filters.state || ALL}
						onValueChange={(v) => filters.setState(v === ALL ? "" : v)}
					>
						<SelectTrigger
							id="filter-state-trigger"
							className="h-9 rounded-xl text-sm"
						>
							<SelectValue placeholder="Todos" />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value={ALL}>Todos os estados</SelectItem>
							{BRAZILIAN_STATES.map((s) => (
								<SelectItem key={s} value={s}>
									{s}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="space-y-1.5">
				<span className="text-xs font-medium text-muted-foreground">
					Disponível nos dias
				</span>
				<div className="flex flex-wrap gap-1.5">
					{DAYS.map(({ key, label }) => (
						<button
							key={key}
							type="button"
							onClick={() => filters.toggleDay(key)}
							className={cn(
								"px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer",
								filters.selectedDays.includes(key)
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
