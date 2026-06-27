import type { WalletBalanceProps } from "./WalletBalance.types";

const brl = (n: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(n);

export function WalletBalance({ balance, pendingBalance }: WalletBalanceProps) {
	return (
		<div className="space-y-1">
			<div className="flex justify-between">
				<span className="text-sm text-muted-foreground">Disponivel</span>
				<span className="font-semibold">{brl(balance)}</span>
			</div>
			<div className="flex justify-between">
				<span className="text-sm text-muted-foreground">Pendente</span>
				<span className="font-medium text-muted-foreground">
					{brl(pendingBalance)}
				</span>
			</div>
		</div>
	);
}
