"use client";

import { MonitorCheck } from "lucide-react";

import PageHeader from "@/components/custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReceptionPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Painel de Recepção"
				description="Gerencie check-ins e o fluxo de pacientes da clínica."
				icon={<MonitorCheck className="h-6 w-6" />}
			/>
			<Card>
				<CardHeader>
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Fila de espera
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						O módulo de fila de espera e check-in por QR Code estará disponível em breve.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
