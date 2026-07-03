"use client";

import { useQuery } from "@tanstack/react-query";
import { examLabApi } from "@/lib/api/exam-labs/exam-labs.api";
import { examLabKeys } from "./exam-lab-keys";

export function useExamLabs() {
	return useQuery({
		queryKey: examLabKeys.list(),
		queryFn: () => examLabApi.getAll(),
	});
}
