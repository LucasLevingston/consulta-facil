"use client";

import { Stethoscope } from "lucide-react";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PendingApplicationsContent } from "./PendingApplicationsContent";

export function PendingApplications() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<Stethoscope className="h-4 w-4 text-primary" />
					Solicitações pendentes
				</CardTitle>
			</CardHeader>
			<CardContent>
				<SuspenseBoundary>
					<PendingApplicationsContent />
				</SuspenseBoundary>
			</CardContent>
		</Card>
	);
}
