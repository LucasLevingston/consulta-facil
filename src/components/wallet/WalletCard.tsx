import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WalletResponse } from "@/lib/schemas/billing/wallet.schema";
import { WalletBalance } from "./WalletBalance";

interface WalletCardProps {
	wallet?: WalletResponse;
	isLoading?: boolean;
}

export function WalletCard({ wallet, isLoading }: WalletCardProps) {
	return (
		<Card className="max-w-sm">
			<CardHeader className="flex flex-row items-center gap-2 pb-2">
				<Wallet className="h-5 w-5 text-primary" />
				<CardTitle className="text-base">Minha Carteira</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading || !wallet ? (
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
					</div>
				) : (
					<WalletBalance
						balance={wallet.balance}
						pendingBalance={wallet.pendingBalance}
					/>
				)}
			</CardContent>
		</Card>
	);
}
