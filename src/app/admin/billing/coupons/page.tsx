"use client";

import { Tag } from "lucide-react";
import { CouponsTable } from "@/components/billing/coupons/CouponsTable";
import { CouponUsagesTable } from "@/components/billing/coupons/CouponUsagesTable";
import { CreateCouponDialog } from "@/components/billing/coupons/CreateCouponDialog";
import PageHeader from "@/components/custom/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminCoupons, useAdminCouponUsages } from "@/features/billing";

export default function AdminCouponsPage() {
	const { data: coupons = [], isLoading: loadingCoupons } = useAdminCoupons();
	const { data: usages = [], isLoading: loadingUsages } =
		useAdminCouponUsages();

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
					{loadingCoupons ? (
						<Skeleton className="h-48 w-full" />
					) : (
						<CouponsTable coupons={coupons} />
					)}
				</TabsContent>

				<TabsContent value="usages" className="mt-4">
					{loadingUsages ? (
						<Skeleton className="h-48 w-full" />
					) : (
						<CouponUsagesTable usages={usages} />
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
