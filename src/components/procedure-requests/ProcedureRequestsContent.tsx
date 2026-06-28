"use client";

import { useGetMyProcedureRequests } from "@/hooks/api/procedure-requests/use-get-my-procedure-requests";
import { useApplicationStatus } from "@/hooks/api/professionals/use-application-status";
import { QueryBoundary } from "@/providers/query-boundary";
import { PatientView } from "./PatientView";
import { ProfessionalView } from "./ProfessionalView";

export function ProcedureRequestsContent({
	isProfessional,
}: {
	isProfessional: boolean;
}) {
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
