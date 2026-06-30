import type { ProfessionalResponse } from "@/features/professionals";

export interface DoctorsMapProps {
	doctors: ProfessionalResponse[];
	center?: [number, number];
	zoom?: number;
	className?: string;
}
