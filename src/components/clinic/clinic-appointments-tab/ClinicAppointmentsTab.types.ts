import type { ClinicResponse } from "@/features/clinics";

export interface ClinicAppointmentsTabProps {
	clinic: ClinicResponse;
	isManager: boolean;
	myProfessionalProfileId?: string;
}
