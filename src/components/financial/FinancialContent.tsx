"use client";

import { FeeCalculator } from "@/components/custom/fees/FeeCalculator";
import type { FinancialContentProps } from "./FinancialContent.types";
import { FinancialMonthlyChart } from "./FinancialMonthlyChart";
import { FinancialRecentPayments } from "./FinancialRecentPayments";
import { FinancialSummaryGrid } from "./FinancialSummaryGrid";

export function FinancialContent({ appointments }: FinancialContentProps) {
	return (
		<div className="space-y-6">
			<FinancialSummaryGrid appointments={appointments} />
			<FinancialMonthlyChart appointments={appointments} />
			<FinancialRecentPayments appointments={appointments} />
			<FeeCalculator />
		</div>
	);
}
