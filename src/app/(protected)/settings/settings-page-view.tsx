"use client";

import { Settings } from "lucide-react";

import { AvatarUpload } from "@/components/custom/avatar-upload";
import PageHeader from "@/components/custom/page-header";
import { useApplicationStatus } from "@/components/professionals/hooks";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { usePermission, useUserStore } from "@/features/auth";
import { PatientSettingsFields } from "./patient-settings-fields";
import { ProfessionalSettingsFields } from "./professional-settings-fields";

export function SettingsPageView() {
	const { user } = useUserStore();
	const { can } = usePermission();
	const isProfessional = can("professional:manage");
	const { data: myProfile } = useApplicationStatus();

	return (
		<div className="space-y-6">
			<PageHeader
				title="Configurações"
				description="Gerencie suas informações pessoais e preferências."
				icon={<Settings className="h-6 w-6" />}
			/>
			<Card>
				<CardHeader>
					<CardTitle>Foto de perfil</CardTitle>
					<CardDescription>
						Clique na câmera para alterar sua foto.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<AvatarUpload size="lg" />
				</CardContent>
			</Card>
			{isProfessional ? (
				<ProfessionalSettingsFields
					userId={user?.id ?? ""}
					userEmail={user?.email ?? ""}
					profile={myProfile}
				/>
			) : (
				<PatientSettingsFields
					userId={user?.id ?? ""}
					userEmail={user?.email ?? ""}
				/>
			)}
		</div>
	);
}
