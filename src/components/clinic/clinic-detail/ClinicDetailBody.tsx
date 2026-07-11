"use client";

import { usePermission } from "@/components/auth/hooks";
import { useClinicById } from "@/components/clinic/hooks";
import { useApplicationStatus } from "@/components/professionals/hooks";
import { useUserStore } from "@/features/auth";
import type {
	ClinicDetailBodyProps,
	ClinicTab,
} from "./ClinicDetailBody.types";
import { ClinicDetailHeader } from "./ClinicDetailHeader";
import { ClinicDetailTabs } from "./ClinicDetailTabs";

export function ClinicDetailBody({
	clinicId,
	activeTab,
	setTab,
}: ClinicDetailBodyProps) {
	const user = useUserStore((s) => s.user);
	const { data: clinic } = useClinicById(clinicId);
	const { data: myProfessionalProfile } = useApplicationStatus();
	const { can } = usePermission();

	const isOwner = !!user && clinic.ownerId === user.id;
	const isAdmin = user?.role === "ADMIN";
	const isManager = can("clinic:manage:own", {
		userId: user?.id,
		ownerId: clinic.ownerId,
	});
	const myMembership = clinic.members?.find(
		(m) => m.professionalProfileId === myProfessionalProfile?.id,
	);
	const isMember = !!myMembership || isManager;

	return (
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
	);
}
