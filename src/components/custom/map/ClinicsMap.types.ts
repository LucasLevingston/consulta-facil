import type { ClinicResponse } from "@/features/clinics";

export interface ClinicsMapProps {
	clinics: ClinicResponse[];
	center?: [number, number];
	zoom?: number;
	className?: string;
}
