import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

export interface DoctorDetailsProps {
	userId: string;
	userEmail: string;
	type: "edit" | "create";
	defaultData?: ProfessionalResponse;
}
