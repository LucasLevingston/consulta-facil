"use client";

import { Sliders } from "lucide-react";
import { SystemFeeRow } from "@/components/admin/billing/SystemFeeRow";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { SystemFeeResponse } from "@/features/billing";
import { useSystemFeesPage } from "@/features/billing/hooks/use-system-fees-page";

function AdminSystemFeesContent() {
	const {
		fees,
		editing,
		fixedFee,
		setFixedFee,
		percentageFee,
		setPercentageFee,
		startEdit,
		cancelEdit,
		handleSave,
		saving,
	} = useSystemFeesPage();

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Taxas do Sistema"
				description="Taxas cobradas por tipo de transação. Os valores são salvos no momento da cobrança."
				count={fees.length}
				countLabel="taxa"
				icon={<Sliders className="h-6 w-6" />}
			/>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Tipo</TableHead>
						<TableHead>Taxa Fixa</TableHead>
						<TableHead>Taxa %</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{fees.map((fee: SystemFeeResponse) => (
						<SystemFeeRow
							key={fee.id}
							fee={fee}
							isEditing={editing === fee.id}
							fixedFee={fixedFee}
							setFixedFee={setFixedFee}
							percentageFee={percentageFee}
							setPercentageFee={setPercentageFee}
							onSave={() => handleSave(fee.id)}
							onEdit={() => startEdit(fee)}
							onCancel={cancelEdit}
							saving={saving}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export function AdminSystemFeesView() {
	return (
		<SuspenseBoundary>
			<AdminSystemFeesContent />
		</SuspenseBoundary>
	);
}
