import type { CouponValidationResult } from "@/lib/schemas/billing/coupon.schema";

export interface CouponInputProps {
	amount: number;
	userId: string;
	onApply?: (result: CouponValidationResult) => void;
}
