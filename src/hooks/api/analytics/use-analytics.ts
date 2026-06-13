import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics/analytics.api";

export const useFinancialAnalytics = () =>
	useQuery({
		queryKey: ["analytics", "financial"],
		queryFn: analyticsApi.financial,
	});

export const useUserAnalytics = () =>
	useQuery({
		queryKey: ["analytics", "users"],
		queryFn: analyticsApi.users,
	});

export const useAppointmentAnalytics = () =>
	useQuery({
		queryKey: ["analytics", "appointments"],
		queryFn: analyticsApi.appointments,
	});

export const useReferralAnalytics = () =>
	useQuery({
		queryKey: ["analytics", "referrals"],
		queryFn: analyticsApi.referrals,
	});

export const useSubscriptionAnalytics = () =>
	useQuery({
		queryKey: ["analytics", "subscriptions"],
		queryFn: analyticsApi.subscriptions,
	});
