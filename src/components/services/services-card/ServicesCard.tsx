"use client";

import { Briefcase } from "lucide-react";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ProfessionalService } from "@/features/services";
import { NewServiceButton } from "./NewServiceButton";
import { ServiceRow } from "./ServiceRow";
import type { ServicesCardProps } from "./ServicesCard.types";
import { ServicesEditDialog } from "./ServicesEditDialog";
import { useGetProfessionalServices } from "./use-get-professional-services";

export function ServicesCard({ professionalId }: ServicesCardProps) {
	const { data: services = [], isLoading } =
		useGetProfessionalServices(professionalId);
	const [editing, setEditing] = useState<ProfessionalService | null>(null);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle className="flex items-center gap-2 text-base">
						<Briefcase className="h-4 w-4" />
						Procedimentos
					</CardTitle>
					<CardDescription>
						Serviços e procedimentos que você oferece.
					</CardDescription>
				</div>
				<NewServiceButton />
			</CardHeader>
			<CardContent>
				{isLoading && (
					<p className="text-sm text-muted-foreground">Carregando...</p>
				)}
				{!isLoading && services.length === 0 && (
					<p className="py-4 text-center text-sm text-muted-foreground">
						Nenhum serviço cadastrado ainda.
					</p>
				)}
				<div className="space-y-3">
					{services.map((svc) => (
						<ServiceRow
							key={svc.id}
							service={svc}
							onEdit={() => setEditing(svc)}
						/>
					))}
				</div>
				<ServicesEditDialog
					editing={editing}
					open={!!editing}
					onOpenChange={(v) => {
						if (!v) setEditing(null);
					}}
					onClose={() => setEditing(null)}
				/>
			</CardContent>
		</Card>
	);
}
