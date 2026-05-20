"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
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
import { PROFESSION_SPECIALTIES, professions } from "@/utils/constants";

const ALL = "__all__";

export default function DoctorFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [name, setName] = useState(searchParams.get("name") ?? "");
	const [profession, setProfession] = useState(
		searchParams.get("profession") ?? "",
	);
	const [specialty, setSpecialty] = useState(
		searchParams.get("specialty") ?? "",
	);

	const availableSpecialties = profession
		? (PROFESSION_SPECIALTIES[profession] ?? [])
		: [];

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		const params = new URLSearchParams();
		if (name) params.set("name", name);
		if (profession) params.set("profession", profession);
		if (specialty) params.set("specialty", specialty);
		params.set("page", "0");
		router.replace(`/professionals?${params.toString()}`);
	}, [name, profession, specialty, router]);

	function handleProfessionChange(val: string) {
		setProfession(val === ALL ? "" : val);
		setSpecialty("");
	}

	const hasFilters = !!(name || profession || specialty);

	const clearAll = () => {
		setName("");
		setProfession("");
		setSpecialty("");
	};

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap gap-3 items-center">
				<div className="relative flex-1 min-w-[180px] max-w-xs">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
					<Input
						type="text"
						placeholder="Pesquisar por nome..."
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="pl-9 rounded-xl"
					/>
				</div>

				<Select
					value={profession || ALL}
					onValueChange={handleProfessionChange}
				>
					<SelectTrigger className="w-[180px] rounded-xl">
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
					disabled={!profession}
				>
					<SelectTrigger className="w-[210px] rounded-xl">
						<div className="flex items-center gap-2">
							<SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
							<SelectValue
								placeholder={
									profession ? "Especialidade" : "Escolha a profissão"
								}
							/>
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
					{profession && (
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
						>
							<SlidersHorizontal className="h-3 w-3" />
							{profession}
							<button
								type="button"
								onClick={() => handleProfessionChange(ALL)}
								className="ml-0.5 rounded-full hover:opacity-70 transition-opacity"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{specialty && (
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
						>
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
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
						>
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
				</div>
			)}
		</div>
	);
}
