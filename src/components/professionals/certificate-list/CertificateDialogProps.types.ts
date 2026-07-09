import type { CertificateItem } from "./CertificateItem.types";

export interface CertificateDialogProps {
	open: boolean;
	onClose: () => void;
	editing?: CertificateItem;
}
