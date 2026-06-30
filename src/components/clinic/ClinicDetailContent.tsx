"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { ClinicAppointmentsTab } from "@/components/clinic/ClinicAppointmentsTab";
import { ClinicDetailHeader } from "@/components/clinic/ClinicDetailHeader";
import { ClinicFinancialTab } from "@/components/clinic/ClinicFinancialTab";
import { ClinicMembersTab } from "@/components/clinic/ClinicMembersTab";
import { ClinicOverviewTab } from "@/components/clinic/ClinicOverviewTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermission, useUserStore } from "@/features/auth";
import { useClinicById } from "@/features/clinics";
import { useApplicationStatus } from "@/features/professionals";
import { QueryBoundary } from "@/providers/query-boundary";

const TABS = ["overview", "members", "appointments", "financial"] as const;
type ClinicTab = (typeof TABS)[number];

function isValidTab(v: string | null): v is ClinicTab {
	return TABS.includes(v as ClinicTab);
}

export function ClinicDetailContent() {
	const params = useParams();
	const clinicId = params.id as string;
	const router = useRouter();
	const searchParams = useSearchParams();
	const activeTab: ClinicTab = isValidTab(searchParams.get("tab"))
		? (searchParams.get("tab") as ClinicTab)
		: "overview";

	const user = useUserStore((s) => s.user);
	const { data: clinic, isLoading, error } = useClinicById(clinicId);
	const { data: myDoctorProfile } = useApplicationStatus();
	const { can } = usePermission();

	const isOwner = !!user && clinic?.ownerId === user.id;
	const isAdmin = user?.role === "ADMIN";
	const isManager =
		!!clinic &&
		can("clinic:manage:own", { userId: user?.id, ownerId: clinic.ownerId });

	const myMembership = clinic?.members?.find(
		(m) => m.professionalProfileId === myDoctorProfile?.id,
	);
	const isMember = !!myMembership || isManager;

	function setTab(tab: ClinicTab) {
		const p = new URLSearchParams(searchParams.toString());
		p.set("tab", tab);
		router.replace(`?${p.toString()}`, { scroll: false });
	}

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			{clinic && (
				<div className="space-y-6">
					<ClinicDetailHeader
						clinic={clinic}
						clinicId={clinicId}
						isOwner={isOwner}
						isAdmin={isAdmin}
						hasMembership={!!myMembership}
					/>

					<Tabs
						value={activeTab}
						onValueChange={(v) => setTab(v as ClinicTab)}
						className="space-y-4"
					>
						<TabsList className="flex-wrap h-auto gap-1">
							<TabsTrigger value="overview">Visão Geral</TabsTrigger>
							<TabsTrigger value="members">
								Profissionais ({clinic.members?.length ?? 0})
							</TabsTrigger>
							{isMember && (
								<TabsTrigger value="appointments">Consultas</TabsTrigger>
							)}
							{isManager && (
								<TabsTrigger value="financial">Financeiro</TabsTrigger>
							)}
						</TabsList>

						<TabsContent value="overview">
							<ClinicOverviewTab clinic={clinic} />
						</TabsContent>

						<TabsContent value="members">
							<ClinicMembersTab
								clinic={clinic}
								isManager={isManager}
								currentUserId={user?.id}
							/>
						</TabsContent>

						{isMember && (
							<TabsContent value="appointments">
								<ClinicAppointmentsTab
									clinic={clinic}
									isManager={isManager}
									myProfessionalProfileId={myDoctorProfile?.id}
								/>
							</TabsContent>
						)}

						{isManager && (
							<TabsContent value="financial">
								<ClinicFinancialTab clinic={clinic} />
							</TabsContent>
						)}
					</Tabs>
				</div>
			)}
		</QueryBoundary>
	);
}
