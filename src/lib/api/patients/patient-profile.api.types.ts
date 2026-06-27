export interface PatientSummary {
	id: string;
	name: string;
	lastAppointment: string;
	totalAppointments: number;
}

export interface ProfessionalPatientsParams {
	page?: number;
	size?: number;
	search?: string;
	sort?: "name" | "recent";
}
