import { Star } from "lucide-react";

export function StarDisplay({ rating }: { rating: number }) {
	return (
		<div className="flex gap-0.5">
			{[1, 2, 3, 4, 5].map((n) => (
				<Star
					key={n}
					className={`h-4 w-4 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
				/>
			))}
		</div>
	);
}
