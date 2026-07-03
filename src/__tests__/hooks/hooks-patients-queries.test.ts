import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-profile.api", () => ({
	patientProfileApi: { getAll: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-emergency-contacts.api", () => ({
	patientEmergencyContactsApi: { listEmergencyContacts: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-vaccines.api", () => ({
	patientVaccinesApi: { listVaccines: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-documents.api", () => ({
	patientDocumentsApi: { listDocuments: vi.fn() },
}));

import { useAllAdminPatients } from "@/hooks/api/patients/use-all-admin-patients";
import { useEmergencyContacts } from "@/hooks/api/patients/use-emergency-contacts";
import { usePatientDocuments } from "@/hooks/api/patients/use-patient-documents";
import { useVaccines } from "@/hooks/api/patients/use-vaccines";
import { patientDocumentsApi } from "@/lib/api/patients/patient-documents.api";
import { patientEmergencyContactsApi } from "@/lib/api/patients/patient-emergency-contacts.api";
import { patientProfileApi } from "@/lib/api/patients/patient-profile.api";
import { patientVaccinesApi } from "@/lib/api/patients/patient-vaccines.api";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAllAdminPatients", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches all admin patients", async () => {
		vi.mocked(patientProfileApi.getAll).mockResolvedValueOnce([] as never);
		const { result } = renderHook(() => useAllAdminPatients({}), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([]);
	});
});

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

describe("useVaccines", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches vaccines list", async () => {
		vi.mocked(patientVaccinesApi.listVaccines).mockResolvedValueOnce([
			{ id: "v-1", name: "BCG" },
		] as never);
		const { result } = renderHook(() => useVaccines(), { wrapper: wrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});

describe("usePatientDocuments", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches documents list", async () => {
		vi.mocked(patientDocumentsApi.listDocuments).mockResolvedValueOnce([
			{ id: "doc-1", type: "EXAM" },
		] as never);
		const { result } = renderHook(() => usePatientDocuments(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});
