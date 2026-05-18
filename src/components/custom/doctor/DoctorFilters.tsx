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
import { specialties } from "@/utils/constants";

export default function DoctorFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [name, setName] = useState(searchParams.get("name") || "");
	const [specialty, setSpecialty] = useState(
		searchParams.get("specialty") || "",
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
		router.replace(`/professionals?${params.toString()}`);
	}, [name, specialty, router]);

	const hasFilters = !!(name || specialty);

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap gap-3 items-center">
				<div className="relative flex-1 min-w-[220px] max-w-sm">
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
					<SelectTrigger className="w-[220px] rounded-xl">
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

				{hasFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							setName("");
							setSpecialty("");
						}}
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
