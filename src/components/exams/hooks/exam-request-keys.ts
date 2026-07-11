export const examRequestKeys = {
	all: ["examRequests"] as const,
	my: (status?: string) =>
		[...examRequestKeys.all, "my", status ?? "ALL"] as const,
	byAppointment: (appointmentId: string) =>
		[...examRequestKeys.all, "appointment", appointmentId] as const,
};
