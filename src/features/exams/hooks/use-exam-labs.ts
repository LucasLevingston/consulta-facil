"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { examsRepository } from "../repositories/exams.repository";
import { examLabKeys } from "./exam-lab-keys";

export function useExamLabs() {
	return useSuspenseQuery({
		queryKey: examLabKeys.list(),
		queryFn: () => examsRepository.getAllLabs(),
	});
}
