import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-settings.repository", () => ({
	billingSettingsRepository: {
		getSettings: vi.fn(),
		updateSettings: vi.fn(),
		adminListCommissions: vi.fn(),
		getFeeConfig: vi.fn(),
	},
}));
vi.mock("@/features/billing/repositories/billing-content.repository", () => ({
	billingContentRepository: {
		listFeatures: vi.fn(),
		createFeature: vi.fn(),
		updateFeature: vi.fn(),
		deleteFeature: vi.fn(),
		listSystemFees: vi.fn(),
		updateSystemFee: vi.fn(),
	},
}));

import { useAdminCommissions } from "@/features/billing/hooks/use-admin-commissions";
import { useBillingSettings } from "@/features/billing/hooks/use-billing-settings";
import { useCreateFeature } from "@/features/billing/hooks/use-create-feature";
import { useDeleteFeature } from "@/features/billing/hooks/use-delete-feature";
import { useFeatures } from "@/features/billing/hooks/use-features";
import { useFeeConfig } from "@/features/billing/hooks/use-fee-config";
import { useSystemFees } from "@/features/billing/hooks/use-system-fees";
import { useUpdateBillingSettings } from "@/features/billing/hooks/use-update-billing-settings";
import { useUpdateFeature } from "@/features/billing/hooks/use-update-feature";
import { useUpdateSystemFee } from "@/features/billing/hooks/use-update-system-fee";
import { billingContentRepository } from "@/features/billing/repositories/billing-content.repository";
import { billingSettingsRepository } from "@/features/billing/repositories/billing-settings.repository";

const mockGetSettings = vi.mocked(billingSettingsRepository.getSettings);
const mockUpdateSettings = vi.mocked(billingSettingsRepository.updateSettings);
const mockAdminListCommissions = vi.mocked(
	billingSettingsRepository.adminListCommissions,
);
const mockGetFeeConfig = vi.mocked(billingSettingsRepository.getFeeConfig);

const mockListFeatures = vi.mocked(billingContentRepository.listFeatures);
const mockCreateFeature = vi.mocked(billingContentRepository.createFeature);
const mockUpdateFeature = vi.mocked(billingContentRepository.updateFeature);
const mockDeleteFeature = vi.mocked(billingContentRepository.deleteFeature);
const mockListSystemFees = vi.mocked(billingContentRepository.listSystemFees);
const mockUpdateSystemFee = vi.mocked(billingContentRepository.updateSystemFee);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
	};
}

describe("useBillingSettings", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca as configuracoes de billing", async () => {
		const settings = { commissionPercentage: 10 };
		mockGetSettings.mockResolvedValueOnce(settings as never);
		const { result } = renderHook(() => useBillingSettings(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(settings);
	});
});

describe("useUpdateBillingSettings", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama updateSettings e invalida a query de settings", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		const updated = { commissionPercentage: 15 };
		mockUpdateSettings.mockResolvedValueOnce(updated as never);
		const { result } = renderHook(() => useUpdateBillingSettings(), {
			wrapper: w,
		});
		await act(async () => {
			await result.current.mutateAsync({ commissionPercentage: 15 } as never);
		});
		expect(mockUpdateSettings).toHaveBeenCalledWith({
			commissionPercentage: 15,
		});
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["billing", "settings"],
		});
	});
});

describe("useAdminCommissions", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a lista de comissoes do admin", async () => {
		const commissions = [{ id: "c-1", value: 10 }];
		mockAdminListCommissions.mockResolvedValueOnce(commissions as never);
		const { result } = renderHook(() => useAdminCommissions(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(commissions);
	});
});

describe("useFeeConfig", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a configuracao de taxas", async () => {
		const feeConfig = { percentage: 5 };
		mockGetFeeConfig.mockResolvedValueOnce(feeConfig as never);
		const { result } = renderHook(() => useFeeConfig(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(feeConfig);
	});
});

describe("useFeatures", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a lista de features", async () => {
		const features = [{ id: "f-1", title: "Feature 1" }];
		mockListFeatures.mockResolvedValueOnce(features as never);
		const { result } = renderHook(() => useFeatures(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(features);
	});
});

describe("useCreateFeature", () => {
	beforeEach(() => vi.clearAllMocks());

	it("cria uma feature e invalida a query de features", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		const newFeature = { id: "f-2", title: "Nova feature" };
		mockCreateFeature.mockResolvedValueOnce(newFeature as never);
		const { result } = renderHook(() => useCreateFeature(), { wrapper: w });
		const payload = { title: "Nova feature" };
		await act(async () => {
			await result.current.mutateAsync(payload as never);
		});
		expect(mockCreateFeature).toHaveBeenCalledWith(payload);
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["billing", "features"],
		});
	});
});

describe("useUpdateFeature", () => {
	beforeEach(() => vi.clearAllMocks());

	it("atualiza uma feature e invalida a query de features", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		const updated = { id: "f-1", title: "Atualizada" };
		mockUpdateFeature.mockResolvedValueOnce(updated as never);
		const { result } = renderHook(() => useUpdateFeature(), { wrapper: w });
		await act(async () => {
			await result.current.mutateAsync({
				id: "f-1",
				data: { title: "Atualizada" } as never,
			});
		});
		expect(mockUpdateFeature).toHaveBeenCalledWith("f-1", {
			title: "Atualizada",
		});
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["billing", "features"],
		});
	});
});

describe("useDeleteFeature", () => {
	beforeEach(() => vi.clearAllMocks());

	it("remove uma feature e invalida a query de features", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		mockDeleteFeature.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteFeature(), { wrapper: w });
		await act(async () => {
			await result.current.mutateAsync("f-1");
		});
		expect(mockDeleteFeature).toHaveBeenCalledWith("f-1");
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["billing", "features"],
		});
	});
});

describe("useSystemFees", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a lista de taxas do sistema", async () => {
		const fees = [{ id: "sf-1", percentage: 2 }];
		mockListSystemFees.mockResolvedValueOnce(fees as never);
		const { result } = renderHook(() => useSystemFees(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(fees);
	});
});

describe("useUpdateSystemFee", () => {
	beforeEach(() => vi.clearAllMocks());

	it("atualiza uma taxa do sistema e invalida a query de system-fees", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		const updated = { id: "sf-1", percentage: 3 };
		mockUpdateSystemFee.mockResolvedValueOnce(updated as never);
		const { result } = renderHook(() => useUpdateSystemFee(), { wrapper: w });
		await act(async () => {
			await result.current.mutateAsync({
				id: "sf-1",
				data: { percentage: 3 } as never,
			});
		});
		expect(mockUpdateSystemFee).toHaveBeenCalledWith("sf-1", {
			percentage: 3,
		});
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["billing", "system-fees"],
		});
	});
});
