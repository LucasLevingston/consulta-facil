"use client";

import { useQuery } from "@tanstack/react-query";
import { examLabKeys } from "@/components/exams/hooks";
import { examsRepository } from "@/features/exams";

export function useAvailableSlots(
	examLabId: string | null,
	date: string | null,
) {
	return useQuery({
		queryKey: examLabKeys.slots(examLabId ?? "", date ?? ""),
		queryFn: () =>
			examsRepository.getAvailableSlots(examLabId ?? "", date ?? ""),
		enabled: !!examLabId && !!date,
	});
}
