"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/cn";
import type { CustomFilterProps } from "./custom-filter.types";

export type {
	CustomFilterProps,
	FilterSearchConfig,
	FilterSelectConfig,
	FilterSelectOption,
	FilterSwitchConfig,
} from "./custom-filter.types";

function countActiveFilters(props: CustomFilterProps): number {
	let count = 0;
	if (props.search?.value) count++;
	for (const s of props.selects ?? []) {
		if (s.value) count++;
	}
	for (const sw of props.switches ?? []) {
		if (sw.checked) count++;
	}
	return count;
}

export function CustomFilter({
	search,
	selects,
	switches,
	onReset,
	className,
}: CustomFilterProps) {
	const activeCount = countActiveFilters({ search, selects, switches });
	const hasFilters = activeCount > 0;

	return (
		<div className={cn("flex flex-col gap-3", className)}>
			<div className="flex flex-wrap items-end gap-3">
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
								<SelectItem value="_all">
									{sel.placeholder ?? `Todos`}
								</SelectItem>
								{sel.options.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				))}

				{switches && switches.length > 0 && (
					<div className="flex flex-wrap gap-4">
						{switches.map((sw) => (
							<div key={sw.id} className="flex items-center gap-2">
								<Switch
									id={sw.id}
									checked={sw.checked}
									onCheckedChange={sw.onChange}
								/>
								<Label htmlFor={sw.id} className="text-sm cursor-pointer">
									{sw.label}
								</Label>
							</div>
						))}
					</div>
				)}

				{onReset && hasFilters && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onReset}
						className="gap-1.5 text-muted-foreground"
					>
						<X className="h-3.5 w-3.5" />
						Limpar
						<Badge variant="secondary" className="ml-0.5 h-5 px-1.5 text-xs">
							{activeCount}
						</Badge>
					</Button>
				)}

				{!onReset && hasFilters && (
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<SlidersHorizontal className="h-3.5 w-3.5" />
						{activeCount} filtro{activeCount !== 1 ? "s" : ""} ativo
						{activeCount !== 1 ? "s" : ""}
					</div>
				)}
			</div>
		</div>
	);
}
