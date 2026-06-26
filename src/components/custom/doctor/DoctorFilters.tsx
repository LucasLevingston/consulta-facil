"use client";

import {
	ChevronDown,
	ChevronUp,
	MapPin,
	Search,
	SlidersHorizontal,
	Stethoscope,
	X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BRAZILIAN_STATES } from "@/lib/utils/brazilian-states";
import { cn } from "@/lib/utils/cn";
import { DAYS } from "@/utils/constants/days-of-week";
import { ALL } from "@/utils/constants/filter-sentinels";
import { professions } from "@/utils/constants/profession-specialties";

import { useDoctorFilters } from "./useDoctorFilters";

export default function DoctorFilters() {
	const {
		name,
		setName,
		profession,
		specialty,
		setSpecialty,
		serviceTitle,
		setServiceTitle,
		state,
		setState,
		selectedDays,
		expanded,
		setExpanded,
		availableSpecialties,
		advancedCount,
		totalActive,
		handleProfessionChange,
		toggleDay,
		clearAll,
	} = useDoctorFilters();

	return (
		<div className="space-y-3 w-full">
			{/* Row 1 — filtros básicos */}
			<div className="flex flex-wrap gap-2 items-center">
				<div className="relative flex-1 min-w-[180px] max-w-xs">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
					<Input
						id="filter-name"
						placeholder="Buscar por nome..."
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="pl-9 rounded-xl"
					/>
				</div>

				<Select
					value={profession || ALL}
					onValueChange={handleProfessionChange}
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
					value={specialty || ALL}
					onValueChange={(v) => setSpecialty(v === ALL ? "" : v)}
				>
					<SelectTrigger className="w-[200px] rounded-xl">
						<div className="flex items-center gap-2">
							<SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
							<SelectValue placeholder="Especialidade" />
						</div>
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						<SelectItem value={ALL}>Todas as especialidades</SelectItem>
						{availableSpecialties.map((s) => (
							<SelectItem key={s} value={s}>
								{s}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Button
					variant="outline"
					size="sm"
					onClick={() => setExpanded((v) => !v)}
					className="rounded-xl gap-2 shrink-0"
				>
					<SlidersHorizontal className="h-4 w-4" />
					Mais filtros
					{advancedCount > 0 && (
						<Badge className="h-5 min-w-5 px-1.5 text-[10px] leading-none">
							{advancedCount}
						</Badge>
					)}
					{expanded ? (
						<ChevronUp className="h-3 w-3" />
					) : (
						<ChevronDown className="h-3 w-3" />
					)}
				</Button>

				{totalActive > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearAll}
						className="text-muted-foreground gap-1.5 rounded-xl"
					>
						<X className="h-3.5 w-3.5" />
						Limpar ({totalActive})
					</Button>
				)}
			</div>

			{/* Row 2 — filtros avançados (colapsível) */}
			{expanded && (
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
									value={serviceTitle}
									onChange={(e) => setServiceTitle(e.target.value)}
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
								value={state || ALL}
								onValueChange={(v) => setState(v === ALL ? "" : v)}
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
									onClick={() => toggleDay(key)}
									className={cn(
										"px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer",
										selectedDays.includes(key)
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
			)}

			{/* Active filter badges */}
			{totalActive > 0 && (
				<div className="flex flex-wrap gap-2">
					{name && (
						<FilterBadge
							icon={<Search className="h-3 w-3" />}
							onRemove={() => setName("")}
						>
							&ldquo;{name}&rdquo;
						</FilterBadge>
					)}
					{profession && (
						<FilterBadge onRemove={() => handleProfessionChange(ALL)}>
							{profession}
						</FilterBadge>
					)}
					{specialty && (
						<FilterBadge onRemove={() => setSpecialty("")}>
							{specialty}
						</FilterBadge>
					)}
					{serviceTitle && (
						<FilterBadge
							icon={<Stethoscope className="h-3 w-3" />}
							onRemove={() => setServiceTitle("")}
						>
							{serviceTitle}
						</FilterBadge>
					)}
					{state && (
						<FilterBadge
							icon={<MapPin className="h-3 w-3" />}
							onRemove={() => setState("")}
						>
							{state}
						</FilterBadge>
					)}
					{selectedDays.map((day) => (
						<FilterBadge key={day} onRemove={() => toggleDay(day)}>
							{DAYS.find((d) => d.key === day)?.label ?? day}
						</FilterBadge>
					))}
				</div>
			)}
		</div>
	);
}

function FilterBadge({
	children,
	icon,
	onRemove,
}: {
	children: React.ReactNode;
	icon?: React.ReactNode;
	onRemove: () => void;
}) {
	return (
		<Badge
			variant="secondary"
			className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
		>
			{icon}
			{children}
			<button
				type="button"
				onClick={onRemove}
				className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
			>
				<X className="h-3 w-3" />
			</button>
		</Badge>
	);
}
