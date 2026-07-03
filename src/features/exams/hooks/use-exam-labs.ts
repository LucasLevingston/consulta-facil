"use client";

import { useQuery } from "@tanstack/react-query";
import { examsRepository } from "../repositories/exams.repository";
import { examLabKeys } from "./exam-lab-keys";

export function useExamLabs() {
	return useQuery({
		queryKey: examLabKeys.list(),
		queryFn: examsRepository.getAllLabs,
	});
}
