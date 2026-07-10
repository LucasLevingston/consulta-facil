export interface ProfilePatientMedicalInfoProps {
	patientProfile: Record<string, string | null | undefined> | undefined | null;
	isLoading: boolean;
}
