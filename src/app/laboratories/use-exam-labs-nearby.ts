"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { examLabKeys } from "@/components/exams/hooks";
import { examsRepository } from "@/features/exams";

export function useExamLabsNearby(lat: number, lng: number, radiusKm = 50) {
	return useSuspenseQuery({
		queryKey: examLabKeys.nearby(lat, lng, radiusKm),
		queryFn: () => examsRepository.getLabsNearby(lat, lng, radiusKm),
	});
}
