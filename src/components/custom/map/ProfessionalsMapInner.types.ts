import type { ProfessionalResponse } from "@/features/professionals";

export interface ProfessionalsMapInnerProps {
	professionals: ProfessionalResponse[];
	center?: [number, number];
	zoom?: number;
}
