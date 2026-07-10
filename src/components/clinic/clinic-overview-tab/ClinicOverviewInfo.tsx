import { MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClinicResponse } from "@/features/clinics";

interface Props {
	clinic: ClinicResponse;
	specialties: string[];
}

export function ClinicOverviewInfo({ clinic, specialties }: Props) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base">Informações da clínica</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{clinic.description && (
					<p className="text-sm text-muted-foreground">{clinic.description}</p>
				)}
				<div className="grid gap-3 sm:grid-cols-2">
					{clinic.address && (
						<div className="flex items-start gap-2 text-sm">
							<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
							<div>
								<p className="text-xs text-muted-foreground">Endereço</p>
								<p className="font-medium">{clinic.address}</p>
								{clinic.city && (
									<p className="text-xs text-muted-foreground">
										{clinic.city}
										{clinic.state ? `, ${clinic.state}` : ""}
										{clinic.zipCode ? ` — ${clinic.zipCode}` : ""}
									</p>
								)}
							</div>
						</div>
					)}
					{clinic.phone && (
						<div className="flex items-start gap-2 text-sm">
							<Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
							<div>
								<p className="text-xs text-muted-foreground">Telefone</p>
								<p className="font-medium">{clinic.phone}</p>
							</div>
						</div>
					)}
				</div>
				{specialties.length > 0 && (
					<div>
						<p className="mb-2 text-xs text-muted-foreground">
							Especialidades disponíveis
						</p>
						<div className="flex flex-wrap gap-1.5">
							{specialties.map((s) => (
								<Badge key={s} variant="secondary">
									{s}
								</Badge>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
