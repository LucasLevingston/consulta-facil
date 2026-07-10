"use client";

import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { PatientRequestsView } from "@/components/procedure-requests/patient-request-flow";
import { ProfessionalRequestsView } from "@/components/procedure-requests/professional-request-flow";
import type { ProcedureRequestsContentProps } from "./ProcedureRequestsContent.types";

export function ProcedureRequestsContent({
	isProfessional,
}: ProcedureRequestsContentProps) {
	return (
		<SuspenseBoundary>
			{isProfessional ? <ProfessionalRequestsView /> : <PatientRequestsView />}
		</SuspenseBoundary>
	);
}
