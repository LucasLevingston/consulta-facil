import type { ProcedureRequest } from "@/features/procedure-requests";

export interface ProfessionalViewProps {
	requests: ProcedureRequest[];
	professionalId: string;
}
