import type { ProfessionalResponse } from "@/features/professionals";

export type CertificateItem = NonNullable<
	ProfessionalResponse["certificates"]
>[number];

export interface CertificateDialogProps {
	open: boolean;
	onClose: () => void;
	editing?: CertificateItem;
}
