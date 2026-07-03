import { describe, expect, it } from "vitest";

import { notificationSchema } from "@/lib/schemas/notification/notification.schema";

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
