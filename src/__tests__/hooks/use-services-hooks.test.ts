import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/services/professional-services.api", () => ({
	professionalServicesApi: {
		getByProfessional: vi.fn(),
		create: vi.fn(),
		deactivate: vi.fn(),
		update: vi.fn(),
	},
}));
vi.mock("@/lib/api/professionals/professional-settings.api", () => ({
	professionalSettingsApi: {
		updatePaymentSettings: vi.fn(),
		setConsultationPrice: vi.fn(),
	},
}));

import { useCreateService } from "@/features/services/hooks/use-create-service";
import { useDeactivateService } from "@/features/services/hooks/use-deactivate-service";
import { useGetProfessionalServices } from "@/features/services/hooks/use-get-professional-services";
import { useSetConsultationPrice } from "@/features/services/hooks/use-set-consultation-price";
import { useUpdatePaymentSettings } from "@/features/services/hooks/use-update-payment-settings";
import { useUpdateService } from "@/features/services/hooks/use-update-service";
import { professionalSettingsApi } from "@/lib/api/professionals/professional-settings.api";
import { professionalServicesApi } from "@/lib/api/services/professional-services.api";

const mockGetByProfessional = vi.mocked(
	professionalServicesApi.getByProfessional,
);
const mockCreate = vi.mocked(professionalServicesApi.create);
const mockDeactivate = vi.mocked(professionalServicesApi.deactivate);
const mockUpdate = vi.mocked(professionalServicesApi.update);
const mockUpdatePaymentSettings = vi.mocked(
	professionalSettingsApi.updatePaymentSettings,
);
const mockSetConsultationPrice = vi.mocked(
	professionalSettingsApi.setConsultationPrice,
);

const service = { id: "svc-1", title: "Consulta", price: 150, active: true };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useGetProfessionalServices", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when professionalId empty", () => {
		const { result } = renderHook(() => useGetProfessionalServices(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when professionalId provided", async () => {
		mockGetByProfessional.mockResolvedValueOnce([service] as never);
		const { result } = renderHook(() => useGetProfessionalServices("prof-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});

describe("useCreateService", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls create with data", async () => {
		mockCreate.mockResolvedValueOnce(service as never);
		const { result } = renderHook(() => useCreateService(), {
			wrapper: wrapper(),
		});
		const data = { title: "Consulta", price: 150 };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCreate).toHaveBeenCalledWith(data);
	});
});

describe("useDeactivateService", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls deactivate with serviceId", async () => {
		mockDeactivate.mockResolvedValueOnce(service as never);
		const { result } = renderHook(() => useDeactivateService(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("svc-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDeactivate).toHaveBeenCalledWith("svc-1");
	});
});

describe("useUpdateService", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls update with serviceId and data", async () => {
		mockUpdate.mockResolvedValueOnce(service as never);
		const { result } = renderHook(() => useUpdateService(), {
			wrapper: wrapper(),
		});
		const data = { title: "Consulta Premium" };
		await act(async () => {
			result.current.mutate({ serviceId: "svc-1", data: data as never });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdate).toHaveBeenCalledWith("svc-1", data);
	});
});

describe("useUpdatePaymentSettings", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls updatePaymentSettings with data", async () => {
		mockUpdatePaymentSettings.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useUpdatePaymentSettings(), {
			wrapper: wrapper(),
		});
		const data = { acceptsPix: true, acceptsCreditCard: true };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdatePaymentSettings).toHaveBeenCalledWith(data);
	});
});

describe("useSetConsultationPrice", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls setConsultationPrice with price", async () => {
		mockSetConsultationPrice.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useSetConsultationPrice(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(200);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockSetConsultationPrice).toHaveBeenCalledWith(200);
	});
});
