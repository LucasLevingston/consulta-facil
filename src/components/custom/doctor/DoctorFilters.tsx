"use client";

import { Search, SlidersHorizontal, Star, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
import { specialties } from "@/utils/constants";

const RATING_OPTIONS = [
	{ label: "Qualquer avaliação", value: "0" },
	{ label: "3+ estrelas", value: "3" },
	{ label: "4+ estrelas", value: "4" },
	{ label: "4.5+ estrelas", value: "4.5" },
];

const CONSULTATION_OPTIONS = [
	{ label: "Qualquer quantidade", value: "0" },
	{ label: "10+ consultas", value: "10" },
	{ label: "25+ consultas", value: "25" },
	{ label: "50+ consultas", value: "50" },
	{ label: "100+ consultas", value: "100" },
];

export default function DoctorFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [name, setName] = useState(searchParams.get("name") ?? "");
	const [specialty, setSpecialty] = useState(searchParams.get("specialty") ?? "");
	const [minRating, setMinRating] = useState(searchParams.get("minRating") ?? "0");
	const [minConsultations, setMinConsultations] = useState(
		searchParams.get("minConsultations") ?? "0",
	);

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		const params = new URLSearchParams();
		if (name) params.set("name", name);
		if (specialty) params.set("specialty", specialty);
		if (minRating !== "0") params.set("minRating", minRating);
		if (minConsultations !== "0") params.set("minConsultations", minConsultations);
		router.replace(`/professionals?${params.toString()}`);
	}, [name, specialty, minRating, minConsultations, router]);

	const hasFilters = !!(name || specialty || minRating !== "0" || minConsultations !== "0");

	const clearAll = () => {
		setName("");
		setSpecialty("");
		setMinRating("0");
		setMinConsultations("0");
	};

	const ratingLabel = RATING_OPTIONS.find((o) => o.value === minRating)?.label;
	const consultationsLabel = CONSULTATION_OPTIONS.find((o) => o.value === minConsultations)?.label;

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap gap-3 items-center">
				<div className="relative flex-1 min-w-[200px] max-w-xs">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
					<Input
						type="text"
						placeholder="Pesquisar por nome..."
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="pl-9 rounded-xl"
					/>
				</div>

				<Select value={specialty} onValueChange={setSpecialty}>
					<SelectTrigger className="w-[200px] rounded-xl">
						<div className="flex items-center gap-2">
							<SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
							<SelectValue placeholder="Especialidade" />
						</div>
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						{specialties.map((s) => (
							<SelectItem key={s} value={s}>
								{s}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={minRating} onValueChange={setMinRating}>
					<SelectTrigger className="w-[180px] rounded-xl">
						<div className="flex items-center gap-2">
							<Star className="h-4 w-4 text-muted-foreground shrink-0" />
							<SelectValue placeholder="Avaliação" />
						</div>
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						{RATING_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={minConsultations} onValueChange={setMinConsultations}>
					<SelectTrigger className="w-[190px] rounded-xl">
						<div className="flex items-center gap-2">
							<SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
							<SelectValue placeholder="Nº de consultas" />
						</div>
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						{CONSULTATION_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{hasFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearAll}
						className="text-muted-foreground gap-1.5 rounded-xl"
					>
						<X className="h-3.5 w-3.5" />
						Limpar filtros
					</Button>
				)}
			</div>

			{hasFilters && (
				<div className="flex flex-wrap gap-2">
					{specialty && (
						<Badge variant="secondary" className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium">
							<SlidersHorizontal className="h-3 w-3" />
							{specialty}
							<button
								type="button"
								onClick={() => setSpecialty("")}
								className="ml-0.5 rounded-full hover:opacity-70 transition-opacity"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{name && (
						<Badge variant="secondary" className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium">
							<Search className="h-3 w-3" />
							&ldquo;{name}&rdquo;
							<button
								type="button"
								onClick={() => setName("")}
								className="ml-0.5 rounded-full hover:opacity-70 transition-opacity"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{minRating !== "0" && (
						<Badge variant="secondary" className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium">
							<Star className="h-3 w-3" />
							{ratingLabel}
							<button
								type="button"
								onClick={() => setMinRating("0")}
								className="ml-0.5 rounded-full hover:opacity-70 transition-opacity"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{minConsultations !== "0" && (
						<Badge variant="secondary" className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium">
							<SlidersHorizontal className="h-3 w-3" />
							{consultationsLabel}
							<button
								type="button"
								onClick={() => setMinConsultations("0")}
								className="ml-0.5 rounded-full hover:opacity-70 transition-opacity"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
				</div>
			)}
		</div>
	);
}
