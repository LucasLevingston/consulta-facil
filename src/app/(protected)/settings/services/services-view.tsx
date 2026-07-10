"use client";

import { Briefcase } from "lucide-react";

import PageHeader from "@/components/custom/page-header";
import { ServicesContent } from "@/components/services/services-content";
import { usePermission } from "@/features/auth";

export function ServicesView() {
	const { can } = usePermission();

	if (!can("services:manage")) {
		return (
			<div className="space-y-6">
				<PageHeader
					title="Meus Serviços"
					description="Gerencie seus procedimentos e preços."
					icon={<Briefcase className="h-6 w-6" />}
				/>
				<p className="text-sm text-muted-foreground">
					Apenas profissionais podem gerenciar serviços.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Meus Serviços"
				description="Cadastre procedimentos com preço e duração. Pacientes poderão selecioná-los ao agendar."
				icon={<Briefcase className="h-6 w-6" />}
			/>
			<ServicesContent />
		</div>
	);
}
