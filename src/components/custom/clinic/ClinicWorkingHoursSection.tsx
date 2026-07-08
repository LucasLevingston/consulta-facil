"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/custom/error-boundary/error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { ClinicWorkingHoursContent } from "./ClinicWorkingHoursContent";
import type { ClinicWorkingHoursSectionProps } from "./ClinicWorkingHoursSection.types";

export function ClinicWorkingHoursSection({
	clinicId,
}: ClinicWorkingHoursSectionProps) {
	return (
		<div className="max-w-2xl space-y-4">
			<div>
				<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					Horários de funcionamento
				</h3>
				<p className="text-xs text-muted-foreground mt-1">
					Configure os dias e horários em que a clínica está aberta.
				</p>
			</div>
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary onReset={reset}>
						<Suspense
							fallback={<Skeleton className="h-64 w-full rounded-2xl" />}
						>
							<ClinicWorkingHoursContent clinicId={clinicId} />
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</div>
	);
}
