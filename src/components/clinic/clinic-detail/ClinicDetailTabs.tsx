import { ClinicAppointmentsTab } from "@/components/clinic/clinic-appointments-tab";
import { ClinicFinancialTab } from "@/components/clinic/clinic-financial-tab";
import { ClinicMembersTab } from "@/components/clinic/clinic-members-tab";
import { ClinicOverviewTab } from "@/components/clinic/clinic-overview-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ClinicResponse } from "@/features/clinics";

interface Props {
	clinic: ClinicResponse;
	activeTab: string;
	onTabChange: (tab: string) => void;
	isMember: boolean;
	isManager: boolean;
	currentUserId: string | undefined;
	myProfessionalProfileId: string | undefined;
}

export function ClinicDetailTabs({
	clinic,
	activeTab,
	onTabChange,
	isMember,
	isManager,
	currentUserId,
	myProfessionalProfileId,
}: Props) {
	return (
		<Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
			<TabsList className="h-auto flex-wrap gap-1">
				<TabsTrigger value="overview">Visão Geral</TabsTrigger>
				<TabsTrigger value="members">
					Profissionais ({clinic.members?.length ?? 0})
				</TabsTrigger>
				{isMember && <TabsTrigger value="appointments">Consultas</TabsTrigger>}
				{isManager && <TabsTrigger value="financial">Financeiro</TabsTrigger>}
			</TabsList>
			<TabsContent value="overview">
				<ClinicOverviewTab clinic={clinic} />
			</TabsContent>
			<TabsContent value="members">
				<ClinicMembersTab
					clinic={clinic}
					isManager={isManager}
					currentUserId={currentUserId}
				/>
			</TabsContent>
			{isMember && (
				<TabsContent value="appointments">
					<ClinicAppointmentsTab
						clinic={clinic}
						isManager={isManager}
						myProfessionalProfileId={myProfessionalProfileId}
					/>
				</TabsContent>
			)}
			{isManager && (
				<TabsContent value="financial">
					<ClinicFinancialTab clinic={clinic} />
				</TabsContent>
			)}
		</Tabs>
	);
}
