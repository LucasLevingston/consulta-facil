import { XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
	reason: string;
}

export function AppointmentCancellationCard({ reason }: Props) {
	return (
		<Card className="border-destructive/30 bg-destructive/5">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm font-medium text-destructive/80">
					<XCircle className="h-4 w-4" />
					Motivo do cancelamento
				</CardTitle>
			</CardHeader>
			<CardContent className="-mt-2">
				<p className="text-sm">{reason}</p>
			</CardContent>
		</Card>
	);
}
