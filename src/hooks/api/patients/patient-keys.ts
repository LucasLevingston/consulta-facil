export const patientKeys = {
	all: ["patients"] as const,
	me: () => [...patientKeys.all, "me"] as const,
	detail: (userId: string) => [...patientKeys.all, userId] as const,
	medicalRecords: (userId: string) =>
		[...patientKeys.all, userId, "medical-records"] as const,
};
