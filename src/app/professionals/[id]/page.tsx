"use client";

import { Stethoscope } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProfessionalDetailCards } from "@/components/professionals/ProfessionalDetailCards";
import { ProfessionalHeroCard } from "@/components/professionals/ProfessionalHeroCard";
import { RatingDistributionCard } from "@/components/professionals/RatingDistributionCard";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/features/auth";
import { useStartConversation } from "@/features/messaging";
import {
	useProfessional,
	useProfessionalRatings,
} from "@/features/professionals";
import { QueryBoundary } from "@/providers/query-boundary";

export default function ProfessionalProfilePage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const { data: professional, isLoading, error } = useProfessional(id);
	const { data: ratings } = useProfessionalRatings(id);
	const user = useUserStore((s) => s.user);
	const startConversation = useStartConversation();

	function handleMessage() {
		if (!professional?.userId) return;
		startConversation.mutate(professional.userId, {
			onSuccess: (conv) => router.push(`/dashboard/messages?c=${conv.id}`),
		});
	}

	if (!professional) {
		return (
			<div className="flex flex-col items-center justify-center py-24 text-center gap-4">
				<Stethoscope className="h-12 w-12 text-muted-foreground/40" />
				<h2 className="text-xl font-semibold">Profissional não encontrado</h2>
				<p className="text-muted-foreground text-sm">
					O profissional que você está procurando não existe ou foi removido.
				</p>
				<Button variant="outline" onClick={() => router.push("/professionals")}>
					Ver todos os profissionais
				</Button>
			</div>
		);
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
		<QueryBoundary isLoading={isLoading} error={error}>
			<ProfessionalHeroCard
				professional={professional}
				initials={initials}
				hasUser={!!user}
				messagePending={startConversation.isPending}
				onMessage={handleMessage}
				onSchedule={() =>
					router.push(
						`/dashboard/appointments/create?professionalid=${professional.id}`,
					)
				}
			/>
			<ProfessionalDetailCards professional={professional} />
			{ratings && <RatingDistributionCard ratings={ratings} />}
		</QueryBoundary>
	);
}
