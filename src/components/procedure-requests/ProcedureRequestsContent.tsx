"use client";

import { useGetMyProcedureRequests } from "@/features/procedure-requests";
import { useApplicationStatus } from "@/features/professionals";
import { QueryBoundary } from "@/providers/query-boundary";
import { PatientView } from "./PatientView";
import type { ProcedureRequestsContentProps } from "./ProcedureRequestsContent.types";
import { ProfessionalView } from "./ProfessionalView";

export function ProcedureRequestsContent({
	isProfessional,
}: ProcedureRequestsContentProps) {
	const { data: requests = [], isLoading, error } = useGetMyProcedureRequests();
	const profileQuery = useApplicationStatus();

	if (isProfessional) {
		return (
			<QueryBoundary
				isLoading={isLoading || profileQuery.isLoading}
				error={error ?? profileQuery.error}
			>
				<ProfessionalView
					requests={requests}
					professionalId={profileQuery.data?.id ?? ""}
				/>
			</QueryBoundary>
		);
	}

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<PatientView requests={requests} />
		</QueryBoundary>
	);
}
