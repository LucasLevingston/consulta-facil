import { FileCheck, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProfessionalResponse } from "@/features/professionals";
import { ProfessionalInfoRow } from "./ProfessionalInfoRow";

interface Props {
	professional: ProfessionalResponse;
}

export function ProfessionalContactCard({ professional }: Props) {
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Informações de contato</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{professional.email && (
						<ProfessionalInfoRow
							icon={Mail}
							label="E-mail"
							value={professional.email}
						/>
					)}
					{professional.phone && (
						<>
							<Separator />
							<ProfessionalInfoRow
								icon={Phone}
								label="Telefone"
								value={professional.phone}
							/>
						</>
					)}
					{professional.licenseNumber && (
						<>
							<Separator />
							<ProfessionalInfoRow
								icon={FileCheck}
								label="Registro CRM"
								value={professional.licenseNumber}
							/>
						</>
					)}
				</CardContent>
			</Card>
			{professional.bio && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Sobre</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
							{professional.bio}
						</p>
					</CardContent>
				</Card>
			)}
		</>
	);
}
