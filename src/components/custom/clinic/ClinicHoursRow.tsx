"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ClinicWorkingHoursItem, DayOfWeek } from "@/features/schedule";
import { DAY_LABELS } from "@/features/schedule";

interface Props {
	row: ClinicWorkingHoursItem;
	onUpdate: (day: DayOfWeek, patch: Partial<ClinicWorkingHoursItem>) => void;
}

export function ClinicHoursRow({ row, onUpdate }: Props) {
	return (
		<Card className={row.isOpen ? "" : "opacity-60"}>
			<CardContent className="pt-4 pb-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
					<div className="flex items-center gap-3 sm:w-36">
						<Switch
							checked={row.isOpen}
							onCheckedChange={(checked) =>
								onUpdate(row.dayOfWeek, { isOpen: checked })
							}
						/>
						<span className="text-sm font-medium w-16">
							{DAY_LABELS[row.dayOfWeek]}
						</span>
						{row.isOpen ? (
							<Badge
								variant="default"
								className="text-xs hidden sm:inline-flex"
							>
								Aberto
							</Badge>
						) : (
							<Badge
								variant="secondary"
								className="text-xs hidden sm:inline-flex"
							>
								Fechado
							</Badge>
						)}
					</div>
					<div className="flex items-center gap-3 flex-1">
						<div className="flex items-center gap-2">
							<Label className="text-xs text-muted-foreground shrink-0">
								Abre
							</Label>
							<Input
								type="time"
								value={row.openTime}
								disabled={!row.isOpen}
								onChange={(e) =>
									onUpdate(row.dayOfWeek, { openTime: e.target.value })
								}
								className="h-9 w-28 rounded-lg border-border bg-bg-input text-sm"
							/>
						</div>
						<div className="flex items-center gap-2">
							<Label className="text-xs text-muted-foreground shrink-0">
								Fecha
							</Label>
							<Input
								type="time"
								value={row.closeTime}
								disabled={!row.isOpen}
								onChange={(e) =>
									onUpdate(row.dayOfWeek, { closeTime: e.target.value })
								}
								className="h-9 w-28 rounded-lg border-border bg-bg-input text-sm"
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
