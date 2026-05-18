import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
	icon: React.ReactNode;
	count: number;
	label: string;
	colorClass: string;
}

export function StatCard({ icon, count, label, colorClass }: StatCardProps) {
	return (
		<Card className="border-border bg-card">
			<CardContent className="flex items-center gap-4 p-5">
				<div
					className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colorClass}`}
				>
					{icon}
				</div>
				<div>
					<p className="text-2xl font-bold text-foreground">{count}</p>
					<p className="text-xs text-muted-foreground">{label}</p>
				</div>
			</CardContent>
		</Card>
	);
}
