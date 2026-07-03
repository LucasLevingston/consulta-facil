"use client";

import { useQuery } from "@tanstack/react-query";
import { examLabApi } from "@/lib/api/exam-labs/exam-labs.api";
import { examLabKeys } from "./exam-lab-keys";

export function useExamLabsNearby(lat: number | null, lng: number | null, radiusKm = 50) {
	return useQuery({
		queryKey: examLabKeys.nearby(lat ?? 0, lng ?? 0, radiusKm),
		queryFn: () => examLabApi.getNearby(lat ?? 0, lng ?? 0, radiusKm),
		enabled: lat !== null && lng !== null,
	});
}
