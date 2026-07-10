"use client";

import { useParams, useRouter } from "next/navigation";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { ProfessionalDetailCards } from "@/components/professionals/professional-detail-cards";
import { ProfessionalHeroCard } from "@/components/professionals/professional-hero-card";
import { RatingDistributionCard } from "@/components/professionals/rating-distribution-card";
import { useUserStore } from "@/features/auth";
import { useStartConversation } from "@/features/messaging";
import { useProfessional } from "./use-professional";
import { useProfessionalRatings } from "./use-professional-ratings";

function ProfessionalProfileContent({ id }: { id: string }) {
	const router = useRouter();
	const { data: professional } = useProfessional(id);
	const { data: ratings } = useProfessionalRatings(id);
	const user = useUserStore((s) => s.user);
	const startConversation = useStartConversation();

	function handleMessage() {
		if (!professional.userId) return;
		startConversation.mutate(professional.userId, {
			onSuccess: (conv) => router.push(`/dashboard/messages?c=${conv.id}`),
		});
	}

	const initials = professional.name
		? professional.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.slice(0, 2)
				.toUpperCase()
		: "?";

	return (
		<>
			<ProfessionalHeroCard
				professional={professional}
				initials={initials}
				messaging={{
					available: !!user,
					pending: startConversation.isPending,
					onSend: handleMessage,
				}}
				onSchedule={() =>
					router.push(
						`/dashboard/appointments/create?professionalid=${professional.id}`,
					)
				}
			/>
			<ProfessionalDetailCards professional={professional} />
			{ratings && <RatingDistributionCard ratings={ratings} />}
		</>
	);
}

export function ProfessionalProfileView() {
	const { id } = useParams<{ id: string }>();

	return (
		<SuspenseBoundary>
			<ProfessionalProfileContent id={id} />
		</SuspenseBoundary>
	);
}
