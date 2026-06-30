"use client";

import { Settings } from "lucide-react";

import { AvatarUpload } from "@/components/custom/avatar-upload";
import PageHeader from "@/components/custom/page-header";
import DoctorDetailsForm from "@/components/forms/DoctorDetails/DoctorDetailsForm";
import PatientDetailsForm from "@/components/forms/PatientDetails/PatientDetailsForm";
import { DocumentPhotoGrid } from "@/components/patients/health/DocumentPhotoGrid";
import { EmergencyContactList } from "@/components/patients/health/EmergencyContactList";
import { MedicalHealthForm } from "@/components/patients/health/MedicalHealthForm";
import { VaccineList } from "@/components/patients/health/VaccineList";
import { AddressForm } from "@/components/professionals/AddressForm";
import { BioForm } from "@/components/professionals/BioForm";
import { CertificateList } from "@/components/professionals/CertificateList";
import { CouncilForm } from "@/components/professionals/CouncilForm";
import { EducationList } from "@/components/professionals/EducationList";
import { ExperienceList } from "@/components/professionals/ExperienceList";
import { SocialLinksForm } from "@/components/professionals/SocialLinksForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { usePermission, useUserStore } from "@/features/auth";
import { useApplicationStatus } from "@/features/professionals";

export default function SettingsPage() {
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

			{isProfessional && myProfile && <BioForm professional={myProfile} />}

			{isProfessional && myProfile && (
				<SocialLinksForm professional={myProfile} />
			)}

			{isProfessional && myProfile && <CouncilForm professional={myProfile} />}

			{isProfessional && myProfile && <AddressForm professional={myProfile} />}

			{isProfessional && myProfile && (
				<EducationList professional={myProfile} />
			)}

			{isProfessional && myProfile && (
				<ExperienceList professional={myProfile} />
			)}

			{isProfessional && myProfile && (
				<CertificateList professional={myProfile} />
			)}

			{!isProfessional && user && <MedicalHealthForm userId={user.id} />}

			{!isProfessional && <EmergencyContactList />}

			{!isProfessional && <VaccineList />}

			{!isProfessional && <DocumentPhotoGrid />}
		</div>
	);
}
