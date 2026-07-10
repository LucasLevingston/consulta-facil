import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import PatientDetailsForm from "@/components/forms/PatientDetails/PatientDetailsForm";
import { DocumentPhotoGrid } from "@/components/patients/health/document-photo-grid";
import { EmergencyContactList } from "@/components/patients/health/emergency-contact-list";
import { MedicalHealthForm } from "@/components/patients/health/medical-health-form";
import { VaccineList } from "@/components/patients/health/vaccine-list";

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
