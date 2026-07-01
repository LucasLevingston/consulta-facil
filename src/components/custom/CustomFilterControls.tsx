"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { FilterSearchConfig } from "./FilterSearchConfig.types";
import type { FilterSelectConfig } from "./FilterSelectConfig.types";

interface Props {
	search?: FilterSearchConfig;
	selects?: FilterSelectConfig[];
}

export function CustomFilterControls({ search, selects }: Props) {
	return (
		<>
			{search && (
				<div className="relative flex-1 min-w-48">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
					<Input
						placeholder={search.placeholder ?? "Buscar..."}
						value={search.value}
						onChange={(e) => search.onChange(e.target.value)}
						className="pl-9"
					/>
					{search.value && (
						<button
							type="button"
							onClick={() => search.onChange("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							aria-label="Limpar busca"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					)}
				</div>
			)}
			{selects?.map((sel) => (
				<div key={sel.id} className="min-w-36">
					<Select
						value={sel.value || "_all"}
						onValueChange={(v) => sel.onChange(v === "_all" ? "" : v)}
					>
						<SelectTrigger>
							<SelectValue placeholder={sel.placeholder ?? sel.label} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="_all">{sel.placeholder ?? "Todos"}</SelectItem>
							{sel.options.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			))}
		</>
	);
}
