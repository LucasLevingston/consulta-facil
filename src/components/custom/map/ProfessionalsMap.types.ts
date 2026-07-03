import type { ProfessionalResponse } from "@/features/professionals";

export interface ProfessionalsMapProps {
	professionals: ProfessionalResponse[];
	center?: [number, number];
	zoom?: number;
	className?: string;
}
