import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PatientAppointmentHistory } from "@/components/patients/detail/PatientAppointmentHistory";
import { PatientMedicalRecord } from "@/components/patients/detail/PatientMedicalRecord";
import type { AppointmentResponse } from "@/features/appointments";
import type { MedicalRecord } from "@/features/patients";

function makeAppointment(
	overrides: Partial<AppointmentResponse> = {},
): AppointmentResponse {
	return {
		id: "a-1",
		patientId: "p-1",
		professionalId: "prof-1",
		scheduledAt: "2024-01-15T10:00:00Z",
		status: "COMPLETED",
		...overrides,
	} as AppointmentResponse;
}

describe("PatientAppointmentHistory", () => {
	it("mostra mensagem de lista vazia quando não há consultas", () => {
		render(<PatientAppointmentHistory appointments={[]} />);
		expect(
			screen.getByText("Nenhuma consulta registrada."),
		).toBeInTheDocument();
	});

	it("renderiza o histórico de consultas com motivo, profissional e especialidade", () => {
		const appointments = [
			makeAppointment({
				id: "a-1",
				reason: "Dor de cabeça",
				professionalName: "Dr. João",
				specialty: "CARDIOLOGY",
				status: "COMPLETED",
			}),
		];
		render(<PatientAppointmentHistory appointments={appointments} />);
		expect(screen.getByText("Dor de cabeça")).toBeInTheDocument();
		expect(screen.getByText(/Dr\. João/)).toBeInTheDocument();
	});

	it("mostra texto padrão quando o motivo da consulta não está informado", () => {
		const appointments = [makeAppointment({ id: "a-2", reason: null })];
		render(<PatientAppointmentHistory appointments={appointments} />);
		expect(screen.getByText("Sem motivo informado")).toBeInTheDocument();
	});

	it("renderiza múltiplas consultas no histórico", () => {
		const appointments = [
			makeAppointment({ id: "a-1", reason: "Consulta 1" }),
			makeAppointment({ id: "a-2", reason: "Consulta 2" }),
		];
		render(<PatientAppointmentHistory appointments={appointments} />);
		expect(screen.getByText("Consulta 1")).toBeInTheDocument();
		expect(screen.getByText("Consulta 2")).toBeInTheDocument();
	});
});

describe("PatientMedicalRecord", () => {
	it("renderiza alergias, medicação, histórico médico e familiar", () => {
		const medicalRecord: MedicalRecord = {
			allergies: "Dipirona",
			currentMedication: "Losartana 50mg",
			pastMedicalHistory: "Hipertensão",
			familyMedicalHistory: "Diabetes na família",
		};
		render(<PatientMedicalRecord medicalRecord={medicalRecord} />);
		expect(screen.getByText("Prontuário médico")).toBeInTheDocument();
		expect(screen.getByText("Alergias")).toBeInTheDocument();
		expect(screen.getByText("Dipirona")).toBeInTheDocument();
		expect(screen.getByText("Medicação atual")).toBeInTheDocument();
		expect(screen.getByText("Losartana 50mg")).toBeInTheDocument();
		expect(screen.getByText("Histórico médico")).toBeInTheDocument();
		expect(screen.getByText("Hipertensão")).toBeInTheDocument();
		expect(screen.getByText("Histórico familiar")).toBeInTheDocument();
		expect(screen.getByText("Diabetes na família")).toBeInTheDocument();
	});

	it("não renderiza seções ausentes do prontuário", () => {
		const medicalRecord: MedicalRecord = {};
		render(<PatientMedicalRecord medicalRecord={medicalRecord} />);
		expect(screen.queryByText("Alergias")).not.toBeInTheDocument();
		expect(screen.queryByText("Medicação atual")).not.toBeInTheDocument();
		expect(screen.queryByText("Histórico médico")).not.toBeInTheDocument();
		expect(screen.queryByText("Histórico familiar")).not.toBeInTheDocument();
	});

	it("renderiza os badges de consentimento quando presentes", () => {
		const medicalRecord: MedicalRecord = {
			privacyConsent: true,
			treatmentConsent: true,
			disclosureConsent: false,
		};
		render(<PatientMedicalRecord medicalRecord={medicalRecord} />);
		expect(screen.getByText("Privacidade")).toBeInTheDocument();
		expect(screen.getByText("Tratamento")).toBeInTheDocument();
		expect(screen.queryByText("Divulgação")).not.toBeInTheDocument();
	});
});
