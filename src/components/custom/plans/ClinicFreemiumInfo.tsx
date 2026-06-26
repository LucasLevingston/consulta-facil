import { Star, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FREE_CONSULTS_PER_DOCTOR } from "@/utils/constants/free-consults-per-doctor";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";

export function ClinicFreemiumInfo() {
	return (
		<div className="grid gap-4 sm:grid-cols-3">
			{(
				[
					{
						icon: Users,
						label: `${FREE_PROFESSIONALS} profissionais grátis`,
						desc: `Clínicas com até ${FREE_PROFESSIONALS} profissionais não pagam plano.`,
					},
					{
						icon: Star,
						label: `${FREE_CONSULTS_PER_DOCTOR} consultas por profissional`,
						desc: `Cada profissional tem ${FREE_CONSULTS_PER_DOCTOR} agendamentos gratuitos pelo sistema.`,
					},
					{
						icon: Zap,
						label: "+20% por profissional extra",
						desc: `A partir do ${FREE_PROFESSIONALS + 1}º profissional, cada um soma 20% ao valor base.`,
					},
				] as const
			).map(({ icon: Icon, label, desc }) => (
				<Card key={label} className="border-dashed">
					<CardContent className="pt-5 pb-4">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
							<Icon className="h-4 w-4 text-primary" />
						</div>
						<p className="mt-3 text-sm font-semibold text-foreground">
							{label}
						</p>
						<p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
