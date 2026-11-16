import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartCardProps } from "./ChartCard.types";

export function ChartCard({ title, children }: ChartCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">{title}</CardTitle>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}
