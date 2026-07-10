import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-emergency-contacts.api", () => ({
	patientEmergencyContactsApi: { listEmergencyContacts: vi.fn() },
}));

import { patientEmergencyContactsApi } from "@/lib/api/patients/patient-emergency-contacts.api";
import { useEmergencyContacts } from "./use-emergency-contacts";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useEmergencyContacts", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches emergency contacts", async () => {
		vi.mocked(
			patientEmergencyContactsApi.listEmergencyContacts,
		).mockResolvedValueOnce([{ id: "ec-1", name: "Mãe" }] as never);
		const { result } = renderHook(() => useEmergencyContacts(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});
