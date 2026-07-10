"use client";

import { useGetMyProcedureRequests } from "@/features/procedure-requests";
import { PatientView } from "./PatientView";

export function PatientRequestsView() {
	const { data: requests } = useGetMyProcedureRequests();
	return <PatientView requests={requests} />;
}
