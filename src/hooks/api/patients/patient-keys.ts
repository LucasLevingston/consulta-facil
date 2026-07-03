export const patientKeys = {
	all: ["patients"] as const,
	me: () => [...patientKeys.all, "me"] as const,
	detail: (userId: string) => [...patientKeys.all, userId] as const,
	medicalRecords: (userId: string) => [...patientKeys.all, userId, "medical-records"] as const,
	emergencyContacts: ["patient", "emergency-contacts"] as const,
	vaccines: ["patient", "vaccines"] as const,
	documents: ["patient", "documents"] as const,
};
