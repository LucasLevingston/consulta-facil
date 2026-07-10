export const analyticsKeys = {
	all: ["analytics"] as const,
	financial: () => [...analyticsKeys.all, "financial"] as const,
	users: () => [...analyticsKeys.all, "users"] as const,
	appointments: () => [...analyticsKeys.all, "appointments"] as const,
	referrals: () => [...analyticsKeys.all, "referrals"] as const,
	subscriptions: () => [...analyticsKeys.all, "subscriptions"] as const,
};
