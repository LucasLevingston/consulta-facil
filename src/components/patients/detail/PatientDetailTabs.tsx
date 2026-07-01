"use client";

import { PatientAppointmentHistory } from "@/components/patients/detail/PatientAppointmentHistory";
import { PatientInfoCard } from "@/components/patients/detail/PatientInfoCard";
import { PatientMedicalRecord } from "@/components/patients/detail/PatientMedicalRecord";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AppointmentResponse } from "@/features/appointments";
import type { MedicalRecord, PatientProfile } from "@/features/patients";

interface Props {
	patient: PatientProfile;
	appointments: AppointmentResponse[];
	medicalRecord: MedicalRecord | undefined;
	activeTab: string;
	onTabChange: (tab: string) => void;
}

export function PatientDetailTabs({
	patient,
	appointments,
	medicalRecord,
	activeTab,
	onTabChange,
}: Props) {
	return (
		<Tabs value={activeTab} onValueChange={onTabChange}>
			<TabsList className="w-full">
				<TabsTrigger value="info" className="flex-1">
					Informações
				</TabsTrigger>
				<TabsTrigger value="prontuario" className="flex-1">
					Prontuário
				</TabsTrigger>
				<TabsTrigger value="consultas" className="flex-1">
					Consultas
				</TabsTrigger>
			</TabsList>
			<TabsContent value="info" className="mt-4">
				<PatientInfoCard patient={patient} />
			</TabsContent>
			<TabsContent value="prontuario" className="mt-4">
				{medicalRecord ? (
					<PatientMedicalRecord medicalRecord={medicalRecord} />
				) : (
					<p className="text-sm text-muted-foreground text-center py-8">
						Nenhum prontuário registrado.
					</p>
				)}
			</TabsContent>
			<TabsContent value="consultas" className="mt-4">
				<PatientAppointmentHistory appointments={appointments} />
			</TabsContent>
		</Tabs>
	);
}
