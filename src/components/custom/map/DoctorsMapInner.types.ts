import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

export interface DoctorsMapInnerProps {
	doctors: ProfessionalResponse[];
	center?: [number, number];
	zoom?: number;
}
