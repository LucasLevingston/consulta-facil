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
import { useAddEmergencyContact } from "./use-add-emergency-contact";

const mockAddEmergencyContact = vi.mocked(
	patientEmergencyContactsApi.addEmergencyContact,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAddEmergencyContact", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama patientEmergencyContactsApi.addEmergencyContact com os dados corretos", async () => {
		const contact = {
			name: "Maria",
			phone: "11999999999",
			relationship: "Mãe",
		};
		mockAddEmergencyContact.mockResolvedValueOnce(contact as never);
		const { result } = renderHook(() => useAddEmergencyContact(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(contact as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAddEmergencyContact.mock.calls[0][0]).toEqual(contact);
	});
});
