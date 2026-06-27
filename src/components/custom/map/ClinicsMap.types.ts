import type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";

export interface ClinicsMapProps {
	clinics: ClinicResponse[];
	center?: [number, number];
	zoom?: number;
	className?: string;
}
