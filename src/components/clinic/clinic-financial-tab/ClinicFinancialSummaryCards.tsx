"use client";

import { CheckCircle2, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
	totalCompleted: number;
	totalFreeUsed: number;
	totalFreeQuota: number;
	extraProfessionals: number;
}

export function ClinicFinancialSummaryCards({
	totalCompleted,
	totalFreeUsed,
	totalFreeQuota,
	extraProfessionals,
}: Props) {
	return (
		<div className="grid gap-4 sm:grid-cols-3">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Consultas realizadas
					</CardTitle>
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
						<CheckCircle2 className="h-4 w-4 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">{totalCompleted}</p>
					<p className="mt-1 text-xs text-muted-foreground">
						consultas concluídas
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Cota gratuita
					</CardTitle>
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
						<Zap className="h-4 w-4 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">
						{totalFreeUsed}
						<span className="text-base font-normal text-muted-foreground">
							/{totalFreeQuota}
						</span>
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						{Math.max(0, totalFreeQuota - totalFreeUsed)} restantes
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Profissionais extras
					</CardTitle>
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
						<Users className="h-4 w-4 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">{extraProfessionals}</p>
					<p className="mt-1 text-xs text-muted-foreground">
						{extraProfessionals === 0
							? "dentro do limite gratuito"
							: `+${extraProfessionals * 20}% no plano`}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
