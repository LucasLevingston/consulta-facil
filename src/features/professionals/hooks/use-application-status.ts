"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsRepository } from "../repositories/professionals.repository";
import { applicationKeys } from "./professional-keys";

export function useApplicationStatus() {
	return useQuery({
		queryKey: applicationKeys.status(),
		queryFn: professionalsRepository.getApplicationStatus,
		retry: false,
	});
}
