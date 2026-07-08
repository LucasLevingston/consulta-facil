"use client";

import { useQuery } from "@tanstack/react-query";
import { examsRepository } from "../repositories/exams.repository";
import { examLabKeys } from "./exam-lab-keys";

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
