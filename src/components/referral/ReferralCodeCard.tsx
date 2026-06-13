import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyReferralButton } from "./CopyReferralButton";

interface ReferralCodeCardProps {
	code: string;
	isLoading?: boolean;
}

export function ReferralCodeCard({ code, isLoading }: ReferralCodeCardProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className="h-5 w-32" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-8 w-48" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Seu codigo de indicacao</CardTitle>
			</CardHeader>
			<CardContent className="flex items-center gap-4">
				<span className="font-mono text-xl font-bold tracking-wider">
					{code}
				</span>
				<CopyReferralButton code={code} />
			</CardContent>
		</Card>
	);
}
