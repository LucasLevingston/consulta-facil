"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { usePermission, useUserStore } from "@/features/auth";
import { useClinicById } from "@/features/clinics";
import { useApplicationStatus } from "@/features/professionals";
import { QueryBoundary } from "@/providers/query-boundary";
import { ClinicDetailHeader } from "./ClinicDetailHeader";
import { ClinicDetailTabs } from "./ClinicDetailTabs";

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
	const { data: myProfessionalProfile } = useApplicationStatus();
	const { can } = usePermission();

	const isOwner = !!user && clinic?.ownerId === user.id;
	const isAdmin = user?.role === "ADMIN";
	const isManager =
		!!clinic &&
		can("clinic:manage:own", { userId: user?.id, ownerId: clinic.ownerId });
	const myMembership = clinic?.members?.find(
		(m) => m.professionalProfileId === myProfessionalProfile?.id,
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
					<ClinicDetailTabs
						clinic={clinic}
						activeTab={activeTab}
						onTabChange={(v) => setTab(v as ClinicTab)}
						isMember={isMember}
						isManager={isManager}
						currentUserId={user?.id}
						myProfessionalProfileId={myProfessionalProfile?.id}
					/>
				</div>
			)}
		</QueryBoundary>
	);
}
