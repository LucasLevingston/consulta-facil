import type { ExamLabResponse } from "@/features/exams";

export interface SlotPickerDialogProps {
	lab: ExamLabResponse;
	examRequestId: string | null;
	open: boolean;
	onClose: () => void;
}
