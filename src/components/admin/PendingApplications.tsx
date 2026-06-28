"use client";

import { Stethoscope } from "lucide-react";

import { PendingApplicationCard } from "@/components/admin/PendingApplicationCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePendingApplications } from "@/hooks/api/professionals/use-pending-applications";
import { QueryBoundary } from "@/providers/query-boundary";

export function PendingApplications() {
	const { data, isLoading, error } = usePendingApplications(0, 50);
	const applications = data?.content ?? [];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<Stethoscope className="h-4 w-4 text-primary" />
					Solicitações pendentes
					{applications.length > 0 && (
						<Badge variant="destructive" className="ml-1 text-xs">
							{applications.length}
						</Badge>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<QueryBoundary isLoading={isLoading} error={error}>
					{applications.length === 0 ? (
						<p className="text-sm text-muted-foreground py-4 text-center">
							Nenhuma solicitação pendente
						</p>
					) : (
						<div className="space-y-3">
							{applications.map((doctor) => (
								<PendingApplicationCard key={doctor.id} doctor={doctor} />
							))}
						</div>
					)}
				</QueryBoundary>
			</CardContent>
		</Card>
	);
}
