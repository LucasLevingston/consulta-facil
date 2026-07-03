import type { SystemFeeResponse } from "@/features/billing";

export interface SystemFeeRowProps {
	fee: SystemFeeResponse;
	isEditing: boolean;
	fixedFee: string;
	setFixedFee: (v: string) => void;
	percentageFee: string;
	setPercentageFee: (v: string) => void;
	onSave: () => void;
	onEdit: () => void;
	onCancel: () => void;
	saving: boolean;
}
