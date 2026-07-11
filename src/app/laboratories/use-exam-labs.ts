"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { examLabKeys } from "@/components/exams/hooks";
import { examsRepository } from "@/features/exams";

export function useExamLabs() {
	return useSuspenseQuery({
		queryKey: examLabKeys.list(),
		queryFn: () => examsRepository.getAllLabs(),
	});
}
