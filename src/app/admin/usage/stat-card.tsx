import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
	title,
	value,
	sub,
	icon,
}: {
	title: string;
	value: string | number;
	sub?: string;
	icon: React.ReactNode;
}) {
	return (
		<Card>
			<CardContent className="p-5">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-muted-foreground">{title}</p>
						<p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
						{sub && (
							<p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
						)}
					</div>
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
						{icon}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
