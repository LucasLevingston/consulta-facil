"use client";

import { Star } from "lucide-react";

import { STAR_RATING_LABELS } from "@/lib/constants/star-rating-labels";
import type { StarRatingProps } from "./StarRating.types";

export function StarRating({
	active,
	onStarClick,
	onStarHover,
	onMouseLeave,
}: StarRatingProps) {
	return (
		<div className="flex flex-col items-center gap-2">
			<fieldset
				className="flex gap-1 border-none p-0 m-0"
				onMouseLeave={onMouseLeave}
			>
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						onClick={() => onStarClick(star)}
						onMouseEnter={() => onStarHover(star)}
						className="p-1 rounded transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
					>
						<Star
							className={`size-8 transition-colors ${
								star <= active
									? "fill-amber-400 text-amber-400"
									: "text-muted-foreground/40"
							}`}
						/>
					</button>
				))}
			</fieldset>
			<span className="text-sm font-medium h-5 text-muted-foreground">
				{active > 0 ? STAR_RATING_LABELS[active] : ""}
			</span>
		</div>
	);
}
