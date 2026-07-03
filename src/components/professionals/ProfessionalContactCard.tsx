import { FileCheck, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProfessionalResponse } from "@/features/professionals";

function InfoRow({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ElementType;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-center gap-3 text-sm">
			<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
				<Icon className="h-4 w-4 text-primary" />
			</div>
			<div>
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="font-medium">{value}</p>
			</div>
		</div>
	);
}

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
						<InfoRow icon={Mail} label="E-mail" value={professional.email} />
					)}
					{professional.phone && (
						<>
							<Separator />
							<InfoRow
								icon={Phone}
								label="Telefone"
								value={professional.phone}
							/>
						</>
					)}
					{professional.licenseNumber && (
						<>
							<Separator />
							<InfoRow
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
