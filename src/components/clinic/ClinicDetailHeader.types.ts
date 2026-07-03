import type { ClinicResponse } from "@/features/clinics";

export interface ClinicDetailHeaderProps {
	clinic: ClinicResponse;
	clinicId: string;
	isOwner: boolean;
	isAdmin: boolean;
	hasMembership: boolean;
}
