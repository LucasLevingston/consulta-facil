"use client";

import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { PatientRequestsView } from "./PatientRequestsView";
import type { ProcedureRequestsContentProps } from "./ProcedureRequestsContent.types";
import { ProfessionalRequestsView } from "./ProfessionalRequestsView";

export function ProcedureRequestsContent({
	isProfessional,
}: ProcedureRequestsContentProps) {
	return (
		<SuspenseBoundary>
			{isProfessional ? <ProfessionalRequestsView /> : <PatientRequestsView />}
		</SuspenseBoundary>
	);
}
