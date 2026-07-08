"use client";

import { useQuery } from "@tanstack/react-query";
import { examsRepository } from "../repositories/exams.repository";
import { examLabKeys } from "./exam-lab-keys";

export function useExamLabsNearby(
	lat: number | null,
	lng: number | null,
	radiusKm = 50,
) {
	return useQuery({
		queryKey: examLabKeys.nearby(lat ?? 0, lng ?? 0, radiusKm),
		queryFn: () => examsRepository.getLabsNearby(lat ?? 0, lng ?? 0, radiusKm),
		enabled: lat !== null && lng !== null,
	});
}
