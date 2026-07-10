import type { UserResponse } from "@/features/auth";

export interface ProfessionalData {
	specialty?: string | null;
	licenseNumber?: string | null;
}

export interface ProfileHeroProps {
	user: UserResponse;
	isProfessional: boolean;
	professionalData?: ProfessionalData | null;
}
