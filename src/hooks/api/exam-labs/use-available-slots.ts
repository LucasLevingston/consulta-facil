"use client";

import { useQuery } from "@tanstack/react-query";
import { examLabApi } from "@/lib/api/exam-labs/exam-labs.api";
import { examLabKeys } from "./exam-lab-keys";

export function useAvailableSlots(
	examLabId: string | null,
	date: string | null,
) {
	return useQuery({
		queryKey: examLabKeys.slots(examLabId ?? "", date ?? ""),
		queryFn: () => examLabApi.getAvailableSlots(examLabId!, date!),
		enabled: !!examLabId && !!date,
	});
}
