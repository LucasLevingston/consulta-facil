import { Star } from "lucide-react";

export function ProfessionalHeroRating({
	rating,
	consultationCount,
}: {
	rating: number;
	consultationCount: number | null | undefined;
}) {
	return (
		<div className="flex items-center gap-2 text-sm pt-1">
			<div className="flex gap-0.5">
				{[1, 2, 3, 4, 5].map((n) => (
					<Star
						key={n}
						className={`h-4 w-4 ${n <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
					/>
				))}
			</div>
			<span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
			{consultationCount != null && consultationCount > 0 && (
				<span className="text-muted-foreground">
					· {consultationCount} consulta
					{consultationCount !== 1 ? "s" : ""}
				</span>
			)}
		</div>
	);
}
