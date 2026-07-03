import type { ClinicResponse } from "@/features/clinics";

export interface ClinicsMapInnerProps {
	clinics: ClinicResponse[];
	center?: [number, number];
	zoom?: number;
}
