import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	Briefcase,
	CalendarDays,
	Mail,
	Phone,
	Shield,
	User,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PatientProfile } from "@/lib/schemas/patient/patient-profile.schema";

function genderLabel(gender?: string | null) {
	if (gender === "MALE") return "Masculino";
	if (gender === "FEMALE") return "Feminino";
	if (gender === "OTHER") return "Outro";
	return null;
}

function InfoRow({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ElementType;
	label: string;
	value?: string | null;
}) {
	if (!value) return null;
	return (
		<div className="flex items-center gap-3 text-sm">
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
				<Icon className="h-4 w-4 text-primary" />
			</div>
			<div>
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="font-medium text-foreground">{value}</p>
			</div>
		</div>
	);
}

export function PatientInfoCard({ patient }: { patient: PatientProfile }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base flex items-center gap-2">
					<User className="h-4 w-4" />
					Informações pessoais
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<InfoRow icon={Mail} label="E-mail" value={patient.email} />
				{patient.phone && <Separator />}
				<InfoRow icon={Phone} label="Telefone" value={patient.phone} />
				{patient.cpf && <Separator />}
				<InfoRow icon={Shield} label="CPF" value={patient.cpf} />
				{patient.birthDate && <Separator />}
				<InfoRow
					icon={CalendarDays}
					label="Data de nascimento"
					value={
						patient.birthDate
							? format(new Date(patient.birthDate), "dd/MM/yyyy", {
									locale: ptBR,
								})
							: null
					}
				/>
				{patient.gender && <Separator />}
				<InfoRow
					icon={User}
					label="Gênero"
					value={genderLabel(patient.gender)}
				/>
				{patient.occupation && <Separator />}
				<InfoRow icon={Briefcase} label="Ocupação" value={patient.occupation} />
			</CardContent>
		</Card>
	);
}
