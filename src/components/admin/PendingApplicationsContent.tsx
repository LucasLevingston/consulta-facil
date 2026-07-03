"use client";

import { PendingApplicationCard } from "@/components/admin/PendingApplicationCard";
import { usePendingApplications } from "@/features/professionals";

export function PendingApplicationsContent() {
	const { data } = usePendingApplications(0, 50);
	const applications = data.content;

	if (applications.length === 0) {
		return (
			<p className="text-sm text-muted-foreground py-4 text-center">
				Nenhuma solicitação pendente
			</p>
		);
	}

	return (
		<div className="space-y-3">
			{applications.map((professional) => (
				<PendingApplicationCard
					key={professional.id}
					professional={professional}
				/>
			))}
		</div>
	);
}
