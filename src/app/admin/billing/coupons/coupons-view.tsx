"use client";

import { Tag } from "lucide-react";
import { CouponsTable } from "@/components/billing/coupons/CouponsTable";
import { CouponUsagesTable } from "@/components/billing/coupons/CouponUsagesTable";
import { CreateCouponDialog } from "@/components/billing/coupons/CreateCouponDialog";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminCoupons, useAdminCouponUsages } from "@/features/billing";

function AdminCouponsContent() {
	const { data: coupons } = useAdminCoupons();
	const { data: usages } = useAdminCouponUsages();

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-start justify-between">
				<PageHeader
					title="Cupons"
					description="Gerencie cupons de desconto e histórico de uso."
					icon={<Tag className="h-6 w-6" />}
				/>
				<CreateCouponDialog />
			</div>

			<Tabs defaultValue="codes">
				<TabsList>
					<TabsTrigger value="codes">Cupons ({coupons.length})</TabsTrigger>
					<TabsTrigger value="usages">Histórico ({usages.length})</TabsTrigger>
				</TabsList>

				<TabsContent value="codes" className="mt-4">
					<CouponsTable coupons={coupons} />
				</TabsContent>

				<TabsContent value="usages" className="mt-4">
					<CouponUsagesTable usages={usages} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export function CouponsView() {
	return (
		<SuspenseBoundary>
			<AdminCouponsContent />
		</SuspenseBoundary>
	);
}
