import type { ProfessionalService } from "@/features/services";

export interface ServiceFormProps {
	existing?: ProfessionalService;
	onClose: () => void;
}
