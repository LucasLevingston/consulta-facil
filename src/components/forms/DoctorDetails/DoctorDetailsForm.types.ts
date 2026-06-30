import type { ProfessionalResponse } from "@/features/professionals";

export interface DoctorDetailsProps {
	userId: string;
	userEmail: string;
	type: "edit" | "create";
	defaultData?: ProfessionalResponse;
}
