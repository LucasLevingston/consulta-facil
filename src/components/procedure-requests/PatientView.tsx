"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PatientRequestCard } from "./PatientRequestCard";
import type { PatientViewProps } from "./PatientView.types";

export function PatientView({ requests }: PatientViewProps) {
	if (requests.length === 0) {
		return (
			<Card className="max-w-3xl">
				<CardContent className="py-12 text-center text-sm text-muted-foreground">
					Nenhuma solicitação de procedimento para você.
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-3 max-w-3xl">
			{requests.map((req) => (
				<PatientRequestCard key={req.id} request={req} />
			))}
		</div>
	);
}
