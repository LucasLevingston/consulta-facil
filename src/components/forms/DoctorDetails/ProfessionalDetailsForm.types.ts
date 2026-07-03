import type { ProfessionalResponse } from "@/features/professionals";

export interface ProfessionalDetailsProps {
	userId: string;
	userEmail: string;
	type: "edit" | "create";
	defaultData?: ProfessionalResponse;
}
