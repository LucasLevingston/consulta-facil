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
import { useDeleteEmergencyContact } from "./use-delete-emergency-contact";

const mockDeleteEmergencyContact = vi.mocked(
	patientEmergencyContactsApi.deleteEmergencyContact,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useDeleteEmergencyContact", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama patientEmergencyContactsApi.deleteEmergencyContact com o id", async () => {
		mockDeleteEmergencyContact.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteEmergencyContact(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("ec-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDeleteEmergencyContact.mock.calls[0][0]).toBe("ec-1");
	});
});
