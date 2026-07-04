import { describe, expect, it } from "vitest";

import { unreadCountSchema } from "@/lib/schemas/notification/unread-count.schema";

describe("unreadCountSchema", () => {
	it("aceita objeto válido", () => {
		expect(unreadCountSchema.safeParse({ count: 5 }).success).toBe(true);
	});

	it("aceita count zero", () => {
		expect(unreadCountSchema.safeParse({ count: 0 }).success).toBe(true);
	});

	it("rejeita sem count (obrigatório)", () => {
		expect(unreadCountSchema.safeParse({}).success).toBe(false);
	});

	it("rejeita tipo inválido em count", () => {
		expect(unreadCountSchema.safeParse({ count: "5" }).success).toBe(false);
	});
});
