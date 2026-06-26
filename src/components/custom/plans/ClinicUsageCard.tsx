import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";
import { FREE_CONSULTS_PER_DOCTOR } from "@/utils/constants/free-consults-per-doctor";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";

export function ClinicUsageCard({ clinic }: { clinic: ClinicResponse }) {
	const currentProfessionals = clinic.members?.length ?? 1;

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
						<Building2 className="h-4 w-4 text-primary" />
					</div>
					<div>
						<CardTitle className="text-base">{clinic.name}</CardTitle>
						<CardDescription>Uso atual da sua clínica</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="grid gap-6 sm:grid-cols-2">
				<div>
					<div className="flex items-center justify-between text-sm mb-2">
						<span className="text-muted-foreground">
							Profissionais na clínica
						</span>
						<span className="font-semibold tabular-nums">
							{currentProfessionals} / {FREE_PROFESSIONALS}
						</span>
					</div>
					<div className="h-2 rounded-full bg-muted overflow-hidden">
						<div
							className="h-full rounded-full bg-primary transition-all"
							style={{
								width: `${Math.min(100, (currentProfessionals / FREE_PROFESSIONALS) * 100)}%`,
							}}
						/>
					</div>
					<p className="mt-1.5 text-xs text-muted-foreground">
						{currentProfessionals >= FREE_PROFESSIONALS
							? "Limite gratuito atingido — plano necessário para adicionar mais"
							: `${FREE_PROFESSIONALS - currentProfessionals} vaga${FREE_PROFESSIONALS - currentProfessionals !== 1 ? "s" : ""} gratuita${FREE_PROFESSIONALS - currentProfessionals !== 1 ? "s" : ""} restante${FREE_PROFESSIONALS - currentProfessionals !== 1 ? "s" : ""}`}
					</p>
				</div>
				<div>
					<div className="flex items-center justify-between text-sm mb-2">
						<span className="text-muted-foreground">Consultas gratuitas</span>
						<span className="font-semibold tabular-nums">
							{currentProfessionals * FREE_CONSULTS_PER_DOCTOR}
						</span>
					</div>
					<div className="flex flex-wrap gap-1 mt-1">
						<Badge variant="secondary" className="text-xs">
							{FREE_CONSULTS_PER_DOCTOR} por profissional
						</Badge>
						<Badge variant="secondary" className="text-xs">
							× {currentProfessionals} profissional
							{currentProfessionals !== 1 ? "is" : ""}
						</Badge>
					</div>
					<p className="mt-1.5 text-xs text-muted-foreground">
						Após esgotar, assinatura obrigatória para novos agendamentos.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
