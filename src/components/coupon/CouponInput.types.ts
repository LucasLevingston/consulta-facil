import type { CouponValidationResult } from "@/features/billing";

export interface CouponInputProps {
	amount: number;
	userId: string;
	onApply?: (result: CouponValidationResult) => void;
}
