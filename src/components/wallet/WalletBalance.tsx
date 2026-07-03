import { formatBRL } from "@/utils/format-brl";
import type { WalletBalanceProps } from "./WalletBalance.types";

export function WalletBalance({ balance, pendingBalance }: WalletBalanceProps) {
	return (
		<div className="space-y-1">
			<div className="flex justify-between">
				<span className="text-sm text-muted-foreground">Disponivel</span>
				<span className="font-semibold">{formatBRL(balance)}</span>
			</div>
			<div className="flex justify-between">
				<span className="text-sm text-muted-foreground">Pendente</span>
				<span className="font-medium text-muted-foreground">
					{formatBRL(pendingBalance)}
				</span>
			</div>
		</div>
	);
}
