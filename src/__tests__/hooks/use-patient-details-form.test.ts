import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => vi.fn()),
}));
vi.mock("next/navigation", () => ({
	useRouter: vi.fn(() => ({ push: vi.fn() })),
}));
vi.mock("@/features/patients", () => ({
	useUpdateMyProfile: vi.fn(),
	PatientFormValidation: { _def: {} },
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { useRouter } from "next/navigation";
import { usePatientDetailsForm } from "@/components/forms/PatientDetails/usePatientDetailsForm";
import { useUpdateMyProfile } from "@/features/patients";

const mockRouter = vi.mocked(useRouter);
const mockUpdate = vi.mocked(useUpdateMyProfile);

const mkWrapper = () => {
	const qc = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
};

const dd = {
	name: "Test User",
	email: "test@test.com",
	phone: "",
	birthDate: new Date("1990-01-01"),
	gender: "MALE",
	address: "",
	occupation: "",
	emergencyContactName: "",
	emergencyContactNumber: "",
	allergies: "",
	currentMedication: "",
	familyMedicalHistory: "",
	pastMedicalHistory: "",
	cpf: "",
	privacyConsent: false,
	treatmentConsent: false,
	disclosureConsent: false,
};

beforeEach(() => {
	vi.clearAllMocks();
	mockRouter.mockReturnValue({ push: vi.fn() } as never);
	mockUpdate.mockReturnValue({
		mutateAsync: vi.fn(),
		isPending: false,
	} as never);
});

describe("usePatientDetailsForm init", () => {
	it("returns form and onSubmit", () => {
		const { result } = renderHook(
			() =>
				usePatientDetailsForm({
					userEmail: "test@test.com",
					type: "edit",
					defaultData: dd as never,
				}),
			{ wrapper: mkWrapper() },
		);
		expect(result.current.form).toBeDefined();
		expect(typeof result.current.onSubmit).toBe("function");
	});

	it("initializes name from defaultData", () => {
		const { result } = renderHook(
			() =>
				usePatientDetailsForm({
					userEmail: "test@test.com",
					type: "edit",
					defaultData: dd as never,
				}),
			{ wrapper: mkWrapper() },
		);
		expect(result.current.form.getValues("name")).toBe("Test User");
	});
});
