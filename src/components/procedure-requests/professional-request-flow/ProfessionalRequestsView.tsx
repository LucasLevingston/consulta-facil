"use client";

import { ErrorState } from "@/components/custom/error-state/error-state";
import { LoadingPage } from "@/components/custom/loading/loading-page";
import { useGetMyProcedureRequests } from "@/components/procedure-requests/hooks";
import { useApplicationStatus } from "@/features/professionals";
import { ProfessionalView } from "./ProfessionalView";

export function ProfessionalRequestsView() {
	const { data: requests } = useGetMyProcedureRequests();
	const profileQuery = useApplicationStatus();

	if (profileQuery.isLoading) {
		return <LoadingPage />;
	}

	if (profileQuery.error) {
		return <ErrorState onRetry={() => profileQuery.refetch()} />;
	}

	return (
		<ProfessionalView
			requests={requests}
			professionalId={profileQuery.data?.id ?? ""}
		/>
	);
}
