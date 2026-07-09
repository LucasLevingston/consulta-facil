import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import PatientDetailsForm from "@/components/forms/PatientDetails/PatientDetailsForm";
import { DocumentPhotoGrid } from "@/components/patients/health/DocumentPhotoGrid";
import { EmergencyContactList } from "@/components/patients/health/EmergencyContactList";
import { MedicalHealthForm } from "@/components/patients/health/MedicalHealthForm";
import { VaccineList } from "@/components/patients/health/VaccineList";

export function PatientSettingsFields({
	userId,
	userEmail,
}: {
	userId: string;
	userEmail: string;
}) {
	return (
		<>
			<div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
				<PatientDetailsForm userId={userId} userEmail={userEmail} type="edit" />
			</div>
			{userId && <MedicalHealthForm userId={userId} />}
			<SuspenseBoundary>
				<EmergencyContactList />
				<VaccineList />
				<DocumentPhotoGrid />
			</SuspenseBoundary>
		</>
	);
}
