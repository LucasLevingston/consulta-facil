import type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";

export interface ClinicsMapInnerProps {
	clinics: ClinicResponse[];
	center?: [number, number];
	zoom?: number;
}
