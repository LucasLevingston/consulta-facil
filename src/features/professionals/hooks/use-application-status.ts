"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalApplicationsRepository } from "../repositories/professional-applications.repository";
import { applicationKeys } from "./application-keys";

export function useApplicationStatus() {
	return useQuery({
		queryKey: applicationKeys.status(),
		queryFn: () => professionalApplicationsRepository.getApplicationStatus(),
		retry: false,
	});
}
