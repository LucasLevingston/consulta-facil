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
	PatientFormValidation: { _def: {} },
}));
vi.mock("./use-update-my-profile", () => ({
	useUpdateMyProfile: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { useRouter } from "next/navigation";
import { useUpdateMyProfile } from "./use-update-my-profile";
import { usePatientDetailsForm } from "./usePatientDetailsForm";

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

describe("usePatientDetailsForm submit", () => {
	it("redirects to / when type=create", async () => {
		const push = vi.fn();
		mockRouter.mockReturnValue({ push } as never);
		mockUpdate.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue({}),
			isPending: false,
		} as never);
		const { result } = renderHook(
			() =>
				usePatientDetailsForm({
					userEmail: "test@test.com",
					type: "create",
					defaultData: dd as never,
				}),
			{ wrapper: mkWrapper() },
		);
		await result.current.onSubmit(dd as never);
		expect(push).toHaveBeenCalledWith("/");
	});
});

describe("usePatientDetailsForm async", () => {
	it("calls mutateAsync on submit", async () => {
		const mutateAsync = vi.fn().mockResolvedValue({});
		mockUpdate.mockReturnValue({ mutateAsync, isPending: false } as never);
		const { result } = renderHook(
			() =>
				usePatientDetailsForm({
					userEmail: "test@test.com",
					type: "edit",
					defaultData: dd as never,
				}),
			{ wrapper: mkWrapper() },
		);
		await result.current.onSubmit(dd as never);
		expect(mutateAsync).toHaveBeenCalledTimes(1);
	});

	it("does not redirect when type=edit", async () => {
		const push = vi.fn();
		mockRouter.mockReturnValue({ push } as never);
		mockUpdate.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue({}),
			isPending: false,
		} as never);
		const { result } = renderHook(
			() =>
				usePatientDetailsForm({
					userEmail: "test@test.com",
					type: "edit",
					defaultData: dd as never,
				}),
			{ wrapper: mkWrapper() },
		);
		await result.current.onSubmit(dd as never);
		expect(push).not.toHaveBeenCalled();
	});
});
