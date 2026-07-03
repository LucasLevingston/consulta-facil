export interface UploadDialogProps {
	open: boolean;
	onClose: () => void;
	file: File | null;
}
