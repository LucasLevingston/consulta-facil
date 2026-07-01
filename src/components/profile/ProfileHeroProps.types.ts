import type { UserResponse } from "@/features/auth";
import type { ProfessionalData } from "./ProfessionalData.types";

export interface ProfileHeroProps {
	user: UserResponse;
	isProfessional: boolean;
	professionalData?: ProfessionalData | null;
}
