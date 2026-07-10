"use client";

import { useGetMyProcedureRequests } from "@/components/procedure-requests/hooks";
import { PatientView } from "./PatientView";

export function PatientRequestsView() {
	const { data: requests } = useGetMyProcedureRequests();
	return <PatientView requests={requests} />;
}
