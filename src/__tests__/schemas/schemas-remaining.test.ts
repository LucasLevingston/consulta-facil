import { describe, expect, it } from "vitest";

import { anamnesisSchema } from "@/lib/schemas/anamnesis/anamnesis.schema";
import { prontuarioSchema } from "@/lib/schemas/anamnesis/prontuario.schema";
import { createClinicSchema } from "@/lib/schemas/clinic/create-clinic.schema";
import { inviteReceptionistSchema } from "@/lib/schemas/clinic/invite-receptionist.schema";
import { createExamRequestSchema } from "@/lib/schemas/examRequest/create-exam-request.schema";
import { reviewExamRequestSchema } from "@/lib/schemas/examRequest/review-exam-request.schema";
import { notificationSchema } from "@/lib/schemas/notification/notification.schema";
import { updateMedicalRecordSchema } from "@/lib/schemas/patient/update-medical-record.schema";
import { updatePatientSchema } from "@/lib/schemas/patient/update-patient.schema";
import { createProcedureRequestSchema } from "@/lib/schemas/procedure-request/create-procedure-request.schema";
import { scheduleProcedureRequestSchema } from "@/lib/schemas/procedure-request/schedule-procedure-request.schema";
import { clinicWorkingHoursItemSchema } from "@/lib/schemas/schedule/clinic-working-hours-item.schema";
import { professionalScheduleItemSchema } from "@/lib/schemas/schedule/professional-schedule-item.schema";
import { createServiceSchema } from "@/lib/schemas/service/create-service.schema";

// ── anamnesis.schema ──────────────────────────────────────────────────────────

describe("anamnesisSchema — todos os campos são opcionais", () => {
	it("aceita objeto vazio", () => {
		expect(anamnesisSchema.safeParse({}).success).toBe(true);
	});

	it("aceita todos os campos preenchidos", () => {
		const result = anamnesisSchema.safeParse({
			chiefComplaint: "Dor no peito",
			currentMedications: "AAS",
			allergies: "Penicilina",
			medicalHistory: "HAS",
			familyHistory: "DM",
			observations: "Paciente ansioso",
		});
		expect(result.success).toBe(true);
	});

	it("aceita campos parciais", () => {
		const result = anamnesisSchema.safeParse({ chiefComplaint: "Febre" });
		expect(result.success).toBe(true);
	});
});

describe("prontuarioSchema — todos os campos são opcionais", () => {
	it("aceita objeto vazio", () => {
		expect(prontuarioSchema.safeParse({}).success).toBe(true);
	});

	it("aceita prontuário completo", () => {
		const result = prontuarioSchema.safeParse({
			clinicalNotes: "Notas",
			diagnosis: "Angina",
			diagnosisCid: "I20",
			prescription: "AAS 100mg",
			examRequests: "ECG",
			treatmentPlan: "Otimização",
			followUpInstructions: "Retorno 30 dias",
		});
		expect(result.success).toBe(true);
	});
});

// ── clinic.schema ─────────────────────────────────────────────────────────────

describe("createClinicSchema — validação de clínica", () => {
	it("aceita dados mínimos válidos", () => {
		const result = createClinicSchema.safeParse({ name: "Clínica Saúde" });
		expect(result.success).toBe(true);
	});

	it("rejeita nome com menos de 2 caracteres", () => {
		const result = createClinicSchema.safeParse({ name: "C" });
		expect(result.success).toBe(false);
	});

	it("rejeita nome vazio", () => {
		const result = createClinicSchema.safeParse({ name: "" });
		expect(result.success).toBe(false);
	});

	it("aceita todos os campos opcionais", () => {
		const result = createClinicSchema.safeParse({
			name: "Clínica Saúde",
			description: "Clínica geral",
			phone: "(11) 99999-9999",
			address: "Rua X, 123",
			city: "São Paulo",
			state: "SP",
			zipCode: "01310-100",
			latitude: -23.55,
			longitude: -46.63,
		});
		expect(result.success).toBe(true);
	});

	it("campos opcionais podem ser omitidos", () => {
		const result = createClinicSchema.safeParse({ name: "Clínica Mínima" });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.description).toBeUndefined();
		}
	});
});

describe("inviteReceptionistSchema — validação de e-mail", () => {
	it("aceita e-mail válido", () => {
		const result = inviteReceptionistSchema.safeParse({
			email: "rec@clinica.com",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita e-mail inválido", () => {
		expect(
			inviteReceptionistSchema.safeParse({ email: "nao-e-email" }).success,
		).toBe(false);
		expect(
			inviteReceptionistSchema.safeParse({ email: "sem@ponto" }).success,
		).toBe(false);
	});

	it("rejeita e-mail vazio", () => {
		expect(inviteReceptionistSchema.safeParse({ email: "" }).success).toBe(
			false,
		);
	});
});

// ── patient.schema ────────────────────────────────────────────────────────────

describe("updatePatientSchema", () => {
	it("aceita objeto vazio (occupation opcional)", () => {
		expect(updatePatientSchema.safeParse({}).success).toBe(true);
	});

	it("aceita occupation válida", () => {
		const result = updatePatientSchema.safeParse({ occupation: "Engenheiro" });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.occupation).toBe("Engenheiro");
	});
});

describe("updateMedicalRecordSchema", () => {
	it("aceita objeto vazio (todos opcionais)", () => {
		expect(updateMedicalRecordSchema.safeParse({}).success).toBe(true);
	});

	it("aceita boolean para campos de consentimento", () => {
		const result = updateMedicalRecordSchema.safeParse({
			privacyConsent: true,
			treatmentConsent: false,
			disclosureConsent: true,
		});
		expect(result.success).toBe(true);
	});

	it("rejeita boolean passado como string", () => {
		const result = updateMedicalRecordSchema.safeParse({
			privacyConsent: "true",
		});
		expect(result.success).toBe(false);
	});
});

// ── schedule.schema ───────────────────────────────────────────────────────────

describe("professionalScheduleItemSchema — validação de horário", () => {
	const valid = {
		dayOfWeek: "MONDAY",
		startTime: "08:00",
		endTime: "17:00",
		consultationDurationMinutes: 30,
		breakBetweenConsultationsMinutes: 10,
		isActive: true,
	} as const;

	it("aceita horário válido", () => {
		expect(professionalScheduleItemSchema.safeParse(valid).success).toBe(true);
	});

	it("rejeita dayOfWeek inválido", () => {
		const result = professionalScheduleItemSchema.safeParse({
			...valid,
			dayOfWeek: "INVALID",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita formato de horário sem dois dígitos na hora", () => {
		expect(
			professionalScheduleItemSchema.safeParse({ ...valid, startTime: "8:00" })
				.success,
		).toBe(false);
		expect(
			professionalScheduleItemSchema.safeParse({ ...valid, endTime: "9:30" })
				.success,
		).toBe(false);
		expect(
			professionalScheduleItemSchema.safeParse({ ...valid, startTime: "08:0" })
				.success,
		).toBe(false);
	});

	it("rejeita duration menor que 5 minutos", () => {
		const result = professionalScheduleItemSchema.safeParse({
			...valid,
			consultationDurationMinutes: 4,
		});
		expect(result.success).toBe(false);
	});

	it("rejeita duration maior que 480 minutos", () => {
		const result = professionalScheduleItemSchema.safeParse({
			...valid,
			consultationDurationMinutes: 481,
		});
		expect(result.success).toBe(false);
	});

	it("aceita todos os dias da semana", () => {
		const days = [
			"MONDAY",
			"TUESDAY",
			"WEDNESDAY",
			"THURSDAY",
			"FRIDAY",
			"SATURDAY",
			"SUNDAY",
		] as const;
		for (const day of days) {
			const result = professionalScheduleItemSchema.safeParse({
				...valid,
				dayOfWeek: day,
			});
			expect(result.success).toBe(true);
		}
	});
});

describe("clinicWorkingHoursItemSchema — validação de horário de clínica", () => {
	const valid = {
		dayOfWeek: "MONDAY",
		openTime: "08:00",
		closeTime: "18:00",
		isOpen: true,
	} as const;

	it("aceita horário válido", () => {
		expect(clinicWorkingHoursItemSchema.safeParse(valid).success).toBe(true);
	});

	it("rejeita formato de horário sem dois dígitos na hora", () => {
		expect(
			clinicWorkingHoursItemSchema.safeParse({ ...valid, openTime: "8:00" })
				.success,
		).toBe(false);
	});

	it("aceita isOpen false", () => {
		const result = clinicWorkingHoursItemSchema.safeParse({
			...valid,
			isOpen: false,
		});
		expect(result.success).toBe(true);
	});
});

// ── service.schema ────────────────────────────────────────────────────────────

describe("createServiceSchema — validação de serviço", () => {
	const valid = {
		name: "Consulta",
		price: 200,
		durationMinutes: 30,
		requiresConsultation: false,
	};

	it("aceita dados válidos", () => {
		expect(createServiceSchema.safeParse(valid).success).toBe(true);
	});

	it("rejeita nome com menos de 2 caracteres", () => {
		expect(createServiceSchema.safeParse({ ...valid, name: "C" }).success).toBe(
			false,
		);
	});

	it("rejeita price zero", () => {
		expect(createServiceSchema.safeParse({ ...valid, price: 0 }).success).toBe(
			false,
		);
	});

	it("rejeita price negativo", () => {
		expect(
			createServiceSchema.safeParse({ ...valid, price: -50 }).success,
		).toBe(false);
	});

	it("rejeita durationMinutes zero", () => {
		expect(
			createServiceSchema.safeParse({ ...valid, durationMinutes: 0 }).success,
		).toBe(false);
	});

	it("aceita requiresConsultation true e false", () => {
		expect(
			createServiceSchema.safeParse({ ...valid, requiresConsultation: true })
				.success,
		).toBe(true);
		expect(
			createServiceSchema.safeParse({ ...valid, requiresConsultation: false })
				.success,
		).toBe(true);
	});

	it("description é opcional", () => {
		const result = createServiceSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.description).toBeUndefined();
	});
});

// ── procedure-request.schema ──────────────────────────────────────────────────

describe("createProcedureRequestSchema — campos obrigatórios", () => {
	it("aceita dados válidos", () => {
		const result = createProcedureRequestSchema.safeParse({
			serviceId: "svc-1",
			patientId: "pat-1",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita serviceId vazio", () => {
		const result = createProcedureRequestSchema.safeParse({
			serviceId: "",
			patientId: "pat-1",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita patientId vazio", () => {
		const result = createProcedureRequestSchema.safeParse({
			serviceId: "svc-1",
			patientId: "",
		});
		expect(result.success).toBe(false);
	});

	it("notes é opcional", () => {
		const result = createProcedureRequestSchema.safeParse({
			serviceId: "svc-1",
			patientId: "pat-1",
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.notes).toBeUndefined();
	});
});

describe("scheduleProcedureRequestSchema", () => {
	it("aceita scheduledAt válido", () => {
		const result = scheduleProcedureRequestSchema.safeParse({
			scheduledAt: "2026-07-01T10:00:00",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita scheduledAt vazio", () => {
		const result = scheduleProcedureRequestSchema.safeParse({
			scheduledAt: "",
		});
		expect(result.success).toBe(false);
	});

	it("aceita modality opcional IN_PERSON e ONLINE", () => {
		expect(
			scheduleProcedureRequestSchema.safeParse({
				scheduledAt: "2026-07-01T10:00:00",
				modality: "IN_PERSON",
			}).success,
		).toBe(true);
		expect(
			scheduleProcedureRequestSchema.safeParse({
				scheduledAt: "2026-07-01T10:00:00",
				modality: "ONLINE",
			}).success,
		).toBe(true);
	});

	it("rejeita modality inválida", () => {
		const result = scheduleProcedureRequestSchema.safeParse({
			scheduledAt: "2026-07-01T10:00:00",
			modality: "PRESENCIAL",
		});
		expect(result.success).toBe(false);
	});
});

// ── examRequest.schema ────────────────────────────────────────────────────────

describe("createExamRequestSchema — examName obrigatório", () => {
	it("aceita examName válido", () => {
		const result = createExamRequestSchema.safeParse({
			examName: "HEMOGRAMA_COMPLETO",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita examName vazio", () => {
		const result = createExamRequestSchema.safeParse({ examName: "" });
		expect(result.success).toBe(false);
	});

	it("rejeita sem examName", () => {
		const result = createExamRequestSchema.safeParse({});
		expect(result.success).toBe(false);
	});

	it("instructions é opcional", () => {
		const result = createExamRequestSchema.safeParse({
			examName: "ELETROCARDIOGRAMA",
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.instructions).toBeUndefined();
	});

	it("instructions aceita até 1000 caracteres", () => {
		const longInstructions = "a".repeat(1000);
		const result = createExamRequestSchema.safeParse({
			examName: "ELETROCARDIOGRAMA",
			instructions: longInstructions,
		});
		expect(result.success).toBe(true);
	});

	it("rejeita instructions com mais de 1000 caracteres", () => {
		const tooLong = "a".repeat(1001);
		const result = createExamRequestSchema.safeParse({
			examName: "ELETROCARDIOGRAMA",
			instructions: tooLong,
		});
		expect(result.success).toBe(false);
	});
});

describe("reviewExamRequestSchema — professionalNotes obrigatório", () => {
	it("aceita notes válidas", () => {
		const result = reviewExamRequestSchema.safeParse({
			professionalNotes: "Resultado normal",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita notes vazias", () => {
		const result = reviewExamRequestSchema.safeParse({ professionalNotes: "" });
		expect(result.success).toBe(false);
	});

	it("rejeita notes com mais de 2000 caracteres", () => {
		const tooLong = "a".repeat(2001);
		const result = reviewExamRequestSchema.safeParse({
			professionalNotes: tooLong,
		});
		expect(result.success).toBe(false);
	});
});

// ── notification.schema ───────────────────────────────────────────────────────

describe("notificationSchema — enums type e status", () => {
	const validBase = {
		id: "n-1",
		type: "CLINIC_INVITE",
		title: "Convite",
		message: "Convite recebido",
		status: "PENDING",
		createdAt: "2026-01-01T10:00:00",
	};

	it("aceita notificação válida", () => {
		expect(notificationSchema.safeParse(validBase).success).toBe(true);
	});

	it("aceita todos os tipos válidos", () => {
		const types = [
			"CLINIC_INVITE",
			"GENERAL",
			"APPOINTMENT_SCHEDULED",
			"APPOINTMENT_CONFIRMED",
			"APPOINTMENT_CANCELED",
		];
		for (const type of types) {
			const result = notificationSchema.safeParse({ ...validBase, type });
			expect(result.success).toBe(true);
		}
	});

	it("rejeita type inválido", () => {
		const result = notificationSchema.safeParse({
			...validBase,
			type: "UNKNOWN_TYPE",
		});
		expect(result.success).toBe(false);
	});

	it("aceita todos os status válidos", () => {
		const statuses = ["PENDING", "ACCEPTED", "DECLINED", "READ"];
		for (const status of statuses) {
			const result = notificationSchema.safeParse({ ...validBase, status });
			expect(result.success).toBe(true);
		}
	});

	it("rejeita status inválido", () => {
		const result = notificationSchema.safeParse({
			...validBase,
			status: "UNREAD",
		});
		expect(result.success).toBe(false);
	});

	it("campos opcionais clinicId e professionalProfileId podem ser omitidos", () => {
		const result = notificationSchema.safeParse(validBase);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.clinicId).toBeUndefined();
			expect(result.data.professionalProfileId).toBeUndefined();
		}
	});
});
