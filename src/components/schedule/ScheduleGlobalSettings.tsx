"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ScheduleGlobalSettingsProps } from "./ScheduleGlobalSettings.types";

export function ScheduleGlobalSettings({
	defaultDuration,
	defaultBreak,
	onApply,
}: ScheduleGlobalSettingsProps) {
	const [duration, setDuration] = useState(defaultDuration);
	const [breakTime, setBreakTime] = useState(defaultBreak);

	useEffect(() => {
		setDuration(defaultDuration);
		setBreakTime(defaultBreak);
	}, [defaultDuration, defaultBreak]);

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Configurações de consulta
					</h3>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label
								htmlFor="duration"
								className="text-sm font-semibold text-primary"
							>
								Duração da consulta (min)
							</Label>
							<Input
								id="duration"
								type="number"
								min={5}
								max={480}
								value={duration}
								onChange={(e) => setDuration(Number(e.target.value))}
								className="h-12 rounded-xl border-border bg-bg-input"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="break"
								className="text-sm font-semibold text-primary"
							>
								Intervalo entre consultas (min)
							</Label>
							<Input
								id="break"
								type="number"
								min={0}
								max={120}
								value={breakTime}
								onChange={(e) => setBreakTime(Number(e.target.value))}
								className="h-12 rounded-xl border-border bg-bg-input"
							/>
						</div>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onApply(duration, breakTime)}
					>
						Aplicar a todos os dias
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
