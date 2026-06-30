import type { ProfessionalService } from "@/features/services";

export interface ServiceRowProps {
	service: ProfessionalService;
	onEdit: () => void;
}
