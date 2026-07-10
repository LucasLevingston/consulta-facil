import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-emergency-contacts.api", () => ({
	patientEmergencyContactsApi: {
		addEmergencyContact: vi.fn(),
		updateEmergencyContact: vi.fn(),
		deleteEmergencyContact: vi.fn(),
	},
}));

import { patientEmergencyContactsApi } from "@/lib/api/patients/patient-emergency-contacts.api";
import { useUpdateEmergencyContact } from "./use-update-emergency-contact";

const mockUpdateEmergencyContact = vi.mocked(
	patientEmergencyContactsApi.updateEmergencyContact,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUpdateEmergencyContact", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama patientEmergencyContactsApi.updateEmergencyContact com id e dados", async () => {
		const data = {
			name: "Maria Souza",
			phone: "11988888888",
			relationship: "Mãe",
		};
		mockUpdateEmergencyContact.mockResolvedValueOnce(data as never);
		const { result } = renderHook(() => useUpdateEmergencyContact(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate({ id: "ec-1", data } as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateEmergencyContact).toHaveBeenCalledWith("ec-1", data);
	});
});
