"use client";

import { FileText } from "lucide-react";
import Link from "next/link";

import { ProfileInfoRow } from "@/components/profile/profile-info-row";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProfilePatientMedicalInfoProps } from "./ProfilePatientMedicalInfo.types";

export function ProfilePatientMedicalInfo({
	patientProfile,
	isLoading,
}: ProfilePatientMedicalInfoProps) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base flex items-center gap-2">
					<FileText className="h-4 w-4 text-primary" />
					Informações médicas
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{isLoading ? (
					<div className="space-y-3">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				) : (
					<>
						<ProfileInfoRow
							icon={FileText}
							label="Alergias"
							value={patientProfile?.allergies}
						/>
						<ProfileInfoRow
							icon={FileText}
							label="Medicações"
							value={patientProfile?.currentMedication}
						/>
						<ProfileInfoRow
							icon={FileText}
							label="Histórico médico"
							value={patientProfile?.pastMedicalHistory}
						/>
						{!patientProfile?.allergies &&
							!patientProfile?.currentMedication && (
								<div className="py-4 text-center space-y-2">
									<p className="text-sm text-muted-foreground">
										Nenhuma informação médica registrada
									</p>
									<Button
										variant="outline"
										size="sm"
										asChild
										className="rounded-xl"
									>
										<Link href="/settings">Adicionar informações</Link>
									</Button>
								</div>
							)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
