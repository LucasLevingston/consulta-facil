import { formatBRL } from "@/utils/format-brl";
import type { TopServicesTableProps } from "./TopServicesTable.types";

export function TopServicesTable({ services }: TopServicesTableProps) {
	if (services.length === 0) {
		return (
			<p className="py-6 text-center text-sm text-muted-foreground">
				Nenhum serviço agendado no período.
			</p>
		);
	}

	return (
		<table className="w-full text-sm">
			<thead>
				<tr className="border-b text-left text-muted-foreground">
					<th className="py-2 font-medium">Serviço</th>
					<th className="py-2 text-right font-medium">Agendamentos</th>
					<th className="py-2 text-right font-medium">Receita</th>
				</tr>
			</thead>
			<tbody>
				{services.map((service) => (
					<tr key={service.id} className="border-b last:border-0">
						<td className="py-2">{service.name ?? "Sem nome"}</td>
						<td className="py-2 text-right">{service.count}</td>
						<td className="py-2 text-right">{formatBRL(service.revenue)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
