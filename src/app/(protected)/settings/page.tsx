"use client";

import { Settings } from "lucide-react";

import { AvatarUpload } from "@/components/custom/avatar-upload";
import PageHeader from "@/components/custom/page-header";
import DoctorDetailsForm from "@/components/forms/DoctorDetails/DoctorDetailsForm";
import PatientDetailsForm from "@/components/forms/PatientDetails/PatientDetailsForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { usePermission } from "@/hooks/use-permission";
import { useUserStore } from "@/store/useUserStore";

export default function SettingsPage() {
	const { user } = useUserStore();
	const { can } = usePermission();

	const isProfessional = can("professional:manage");

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

			<div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
				{isProfessional ? (
					<DoctorDetailsForm
						userId={user?.id ?? ""}
						userEmail={user?.email ?? ""}
						type="edit"
					/>
				) : (
					<PatientDetailsForm
						userId={user?.id ?? ""}
						userEmail={user?.email ?? ""}
						type="edit"
					/>
				)}
			</div>
		</div>
	);
}
