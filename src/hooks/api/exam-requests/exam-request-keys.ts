export const examRequestKeys = {
	all: ["examRequests"] as const,
	byAppointment: (appointmentId: string) =>
		[...examRequestKeys.all, "appointment", appointmentId] as const,
};
