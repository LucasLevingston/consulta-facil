"use client";

import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import type { z } from "zod";
import { appointmentKeys } from "@/components/appointments/hooks";
import { appointmentsRepository } from "@/features/appointments";
import type { clinicMemberSchema } from "@/lib/schemas/clinic/clinic-member.schema";
import { FREE_CONSULTS_PER_PROFESSIONAL } from "@/utils/constants/free-consults-per-professional";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";

type ClinicMember = z.infer<typeof clinicMemberSchema>;

export function useClinicFinancialStats(members: ClinicMember[]) {
	const results = useQueries({
		queries: members.map((m) => ({
			queryKey: appointmentKeys.byProfessional(m.professionalProfileId),
			queryFn: () =>
				appointmentsRepository.getByProfessional(
					m.professionalProfileId,
					0,
					100,
				),
		})),
	});

	const isLoading = results.some((r) => r.isLoading);

	const memberStats = useMemo(
		() =>
			members.map((member, i) => {
				const appts = results[i]?.data?.content ?? [];
				const completed = appts.filter((a) => a.status === "COMPLETED").length;
				const freeUsed = Math.min(completed, FREE_CONSULTS_PER_PROFESSIONAL);
				const paidCount = Math.max(
					0,
					completed - FREE_CONSULTS_PER_PROFESSIONAL,
				);
				return { member, completed, freeUsed, paidCount };
			}),
		[results, members],
	);

	const totalCompleted = memberStats.reduce((s, m) => s + m.completed, 0);
	const totalFreeUsed = memberStats.reduce((s, m) => s + m.freeUsed, 0);
	const totalFreeQuota = members.length * FREE_CONSULTS_PER_PROFESSIONAL;
	const totalPaid = memberStats.reduce((s, m) => s + m.paidCount, 0);
	const extraProfessionals = Math.max(0, members.length - FREE_PROFESSIONALS);

	return {
		isLoading,
		memberStats,
		totalCompleted,
		totalFreeUsed,
		totalFreeQuota,
		totalPaid,
		extraProfessionals,
	};
}
