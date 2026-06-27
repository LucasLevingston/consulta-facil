import { Card, CardContent } from "@/components/ui/card";
import type { ReferralStatsCardProps } from "./ReferralStatsCard.types";

const brl = (n: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(n);

export function ReferralStatsCard({ stats }: ReferralStatsCardProps) {
	const items = [
		{ label: "Total Indicados", value: String(stats.totalReferred) },
		{ label: "Comissoes Pendentes", value: String(stats.pendingCommissions) },
		{
			label: "Comissoes Disponiveis",
			value: String(stats.availableCommissions),
		},
		{ label: "Saldo Disponivel", value: brl(stats.availableBalance) },
	];

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			{items.map((item) => (
				<Card key={item.label}>
					<CardContent className="pt-4">
						<p className="text-sm text-muted-foreground">{item.label}</p>
						<p className="text-2xl font-bold mt-1">{item.value}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
