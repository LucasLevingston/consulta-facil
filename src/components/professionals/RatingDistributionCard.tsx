"use client";

import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { RatingDistributionCardProps } from "./RatingDistributionCard.types";

export function RatingDistributionCard({
	ratings,
}: RatingDistributionCardProps) {
	if (ratings.totalRatings === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Avaliacoes</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Nenhuma avaliacao ainda.
					</p>
				</CardContent>
			</Card>
		);
	}

	const stars = [5, 4, 3, 2, 1];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Avaliacoes</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center gap-4">
					<div className="text-center">
						<p className="text-4xl font-bold">
							{ratings.averageRating?.toFixed(1) ?? "–"}
						</p>
						<div className="flex gap-0.5 mt-1 justify-center">
							{[1, 2, 3, 4, 5].map((n) => (
								<Star
									key={n}
									className={`h-3.5 w-3.5 ${
										n <= Math.round(ratings.averageRating ?? 0)
											? "fill-amber-400 text-amber-400"
											: "text-muted-foreground/30"
									}`}
								/>
							))}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							{ratings.totalRatings} avaliacao
							{ratings.totalRatings !== 1 ? "es" : ""}
						</p>
					</div>

					<div className="flex-1 space-y-1.5">
						{stars.map((star) => {
							const count = ratings.distribution[String(star)] ?? 0;
							const pct =
								ratings.totalRatings > 0
									? (count / ratings.totalRatings) * 100
									: 0;
							return (
								<div key={star} className="flex items-center gap-2 text-xs">
									<span className="w-3 text-right text-muted-foreground">
										{star}
									</span>
									<Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
									<Progress value={pct} className="h-2 flex-1" />
									<span className="w-6 text-right text-muted-foreground">
										{count}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
