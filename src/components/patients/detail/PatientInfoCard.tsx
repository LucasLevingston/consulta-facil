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

import { PatientDetailInfoRow } from "@/components/patients/detail/PatientDetailInfoRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PatientProfile } from "@/features/patients";

function genderLabel(gender?: string | null) {
	if (gender === "MALE") return "Masculino";
	if (gender === "FEMALE") return "Feminino";
	if (gender === "OTHER") return "Outro";
	return null;
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
				<PatientDetailInfoRow
					icon={Mail}
					label="E-mail"
					value={patient.email}
				/>
				{patient.phone && <Separator />}
				<PatientDetailInfoRow
					icon={Phone}
					label="Telefone"
					value={patient.phone}
				/>
				{patient.cpf && <Separator />}
				<PatientDetailInfoRow icon={Shield} label="CPF" value={patient.cpf} />
				{patient.birthDate && <Separator />}
				<PatientDetailInfoRow
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
				<PatientDetailInfoRow
					icon={User}
					label="Gênero"
					value={genderLabel(patient.gender)}
				/>
				{patient.occupation && <Separator />}
				<PatientDetailInfoRow
					icon={Briefcase}
					label="Ocupação"
					value={patient.occupation}
				/>
			</CardContent>
		</Card>
	);
}
