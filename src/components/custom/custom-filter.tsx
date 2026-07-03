"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/cn";
import { CustomFilterControls } from "./CustomFilterControls";
import type { CustomFilterProps } from "./CustomFilterProps.types";

export type {
	CustomFilterProps,
	FilterSearchConfig,
	FilterSelectConfig,
	FilterSelectOption,
	FilterSwitchConfig,
} from "./custom-filter.types";

export function CustomFilter({
	search,
	selects,
	switches,
	onReset,
	className,
}: CustomFilterProps) {
	function countActiveFilters(props: CustomFilterProps): number {
		let count = 0;
		if (props.search?.value) count++;
		for (const s of props.selects ?? []) if (s.value) count++;
		for (const sw of props.switches ?? []) if (sw.checked) count++;
		return count;
	}

	const activeCount = countActiveFilters({ search, selects, switches });
	const hasFilters = activeCount > 0;

	return (
		<div className={cn("flex flex-col gap-3", className)}>
			<div className="flex flex-wrap items-end gap-3">
				<CustomFilterControls search={search} selects={selects} />

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
