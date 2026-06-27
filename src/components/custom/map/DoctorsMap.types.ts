import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

export interface DoctorsMapProps {
	doctors: ProfessionalResponse[];
	center?: [number, number];
	zoom?: number;
	className?: string;
}
