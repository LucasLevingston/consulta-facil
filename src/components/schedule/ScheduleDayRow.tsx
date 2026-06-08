"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DAY_LABELS } from "@/lib/schemas/schedule/days-of-week.schema";
import type { ProfessionalScheduleItem } from "@/lib/schemas/schedule/professional-schedule-item.schema";

export function ScheduleDayRow({
	row,
	onChange,
}: {
	row: ProfessionalScheduleItem;
	onChange: (patch: Partial<ProfessionalScheduleItem>) => void;
}) {
	return (
		<Card className={row.isActive ? "" : "opacity-60"}>
			<CardContent className="pt-4 pb-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
					<div className="flex items-center gap-3 sm:w-32">
						<Switch
							checked={row.isActive}
							onCheckedChange={(checked) => onChange({ isActive: checked })}
						/>
						<span className="text-sm font-medium w-16">
							{DAY_LABELS[row.dayOfWeek]}
						</span>
						{row.isActive ? (
							<Badge
								variant="default"
								className="text-xs hidden sm:inline-flex"
							>
								Ativo
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
								De
							</Label>
							<Input
								type="time"
								value={row.startTime}
								disabled={!row.isActive}
								onChange={(e) => onChange({ startTime: e.target.value })}
								className="h-9 w-28 rounded-lg border-border bg-bg-input text-sm"
							/>
						</div>
						<div className="flex items-center gap-2">
							<Label className="text-xs text-muted-foreground shrink-0">
								Até
							</Label>
							<Input
								type="time"
								value={row.endTime}
								disabled={!row.isActive}
								onChange={(e) => onChange({ endTime: e.target.value })}
								className="h-9 w-28 rounded-lg border-border bg-bg-input text-sm"
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
