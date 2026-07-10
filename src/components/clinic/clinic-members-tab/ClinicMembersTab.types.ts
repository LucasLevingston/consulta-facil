import type { ClinicResponse } from "@/features/clinics";

export interface ClinicMembersTabProps {
	clinic: ClinicResponse;
	isManager: boolean;
	currentUserId?: string;
}
