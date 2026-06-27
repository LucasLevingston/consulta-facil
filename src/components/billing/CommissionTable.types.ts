import type { ReferralCommissionResponse } from "@/lib/schemas/billing/commission.schema";

export interface CommissionTableProps {
	commissions: ReferralCommissionResponse[];
}
