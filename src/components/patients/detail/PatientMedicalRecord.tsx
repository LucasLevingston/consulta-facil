import { AlertCircle, FileText, Pill, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { MedicalRecord } from "@/lib/schemas/patient/medical-record.schema";

export function PatientMedicalRecord({
	medicalRecord,
}: {
	medicalRecord: MedicalRecord;
}) {
	const consentCount = [
		medicalRecord.privacyConsent,
		medicalRecord.treatmentConsent,
		medicalRecord.disclosureConsent,
	].filter(Boolean).length;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base flex items-center gap-2">
					<FileText className="h-4 w-4" />
					Prontuário médico
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{medicalRecord.allergies && (
					<div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3">
						<div className="flex items-center gap-2 mb-1">
							<AlertCircle className="h-4 w-4 text-destructive" />
							<p className="text-xs font-semibold text-destructive">Alergias</p>
						</div>
						<p className="text-sm">{medicalRecord.allergies}</p>
					</div>
				)}

				{medicalRecord.currentMedication && (
					<div>
						<div className="flex items-center gap-2 mb-1">
							<Pill className="h-4 w-4 text-muted-foreground" />
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
								Medicação atual
							</p>
						</div>
						<p className="text-sm text-foreground">
							{medicalRecord.currentMedication}
						</p>
					</div>
				)}

				{medicalRecord.pastMedicalHistory && (
					<>
						<Separator />
						<div>
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
								Histórico médico
							</p>
							<p className="text-sm text-foreground">
								{medicalRecord.pastMedicalHistory}
							</p>
						</div>
					</>
				)}

				{medicalRecord.familyMedicalHistory && (
					<>
						<Separator />
						<div>
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
								Histórico familiar
							</p>
							<p className="text-sm text-foreground">
								{medicalRecord.familyMedicalHistory}
							</p>
						</div>
					</>
				)}

				{consentCount > 0 && (
					<>
						<Separator />
						<div className="flex flex-wrap gap-2">
							{medicalRecord.privacyConsent && (
								<Badge variant="outline" className="text-xs gap-1">
									<Shield className="h-3 w-3" /> Privacidade
								</Badge>
							)}
							{medicalRecord.treatmentConsent && (
								<Badge variant="outline" className="text-xs gap-1">
									<Shield className="h-3 w-3" /> Tratamento
								</Badge>
							)}
							{medicalRecord.disclosureConsent && (
								<Badge variant="outline" className="text-xs gap-1">
									<Shield className="h-3 w-3" /> Divulgação
								</Badge>
							)}
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
