import type { ProfessionalResponse } from "@/features/professionals";

export interface DoctorsMapInnerProps {
	doctors: ProfessionalResponse[];
	center?: [number, number];
	zoom?: number;
}
