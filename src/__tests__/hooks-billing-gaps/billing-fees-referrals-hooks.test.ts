import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/billing/referral.api", () => ({
	referralApi: {
		myStats: vi.fn(),
		regenerate: vi.fn(),
		register: vi.fn(),
		adminListAll: vi.fn(),
	},
}));
vi.mock("@/lib/api/billing/system-fee.api", () => ({
	systemFeeApi: {
		listAll: vi.fn(),
		getById: vi.fn(),
		update: vi.fn(),
	},
}));
vi.mock("@/lib/api/billing/feature.api", () => ({
	featureApi: {
		listAll: vi.fn(),
		getById: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
}));
vi.mock("@/lib/api/billing/billing-settings.api", () => ({
	billingSettingsApi: {
		get: vi.fn(),
		update: vi.fn(),
	},
}));

import { useAdminReferrals } from "@/hooks/api/billing/use-admin-referrals";
import { useCreateFeature } from "@/hooks/api/billing/use-create-feature";
import { useDeleteFeature } from "@/hooks/api/billing/use-delete-feature";
import { useMyReferralStats } from "@/hooks/api/billing/use-my-referral-stats";
import { useRegenerateCode } from "@/hooks/api/billing/use-regenerate-code";
import { useSystemFees } from "@/hooks/api/billing/use-system-fees-list";
import { useUpdateBillingSettings } from "@/hooks/api/billing/use-update-billing-settings";
import { useUpdateFeature } from "@/hooks/api/billing/use-update-feature";
import { useUpdateSystemFee } from "@/hooks/api/billing/use-update-system-fee";
import { billingSettingsApi } from "@/lib/api/billing/billing-settings.api";
import { featureApi } from "@/lib/api/billing/feature.api";
import { referralApi } from "@/lib/api/billing/referral.api";
import { systemFeeApi } from "@/lib/api/billing/system-fee.api";

const mockAdminListAllReferrals = vi.mocked(referralApi.adminListAll);
const mockMyStats = vi.mocked(referralApi.myStats);
const mockRegenerate = vi.mocked(referralApi.regenerate);
const mockListAllFees = vi.mocked(systemFeeApi.listAll);
const mockUpdateFee = vi.mocked(systemFeeApi.update);
const mockCreateFeature = vi.mocked(featureApi.create);
const mockDeleteFeature = vi.mocked(featureApi.delete);
const mockUpdateFeature = vi.mocked(featureApi.update);
const mockUpdateSettings = vi.mocked(billingSettingsApi.update);

const referral = { id: "referral-1", userId: "user-1", code: "ABC123" };
const referralStats = { code: "ABC123", totalReferred: 5, totalEarned: 50 };
const referralCode = { code: "XYZ789" };
const systemFee = { id: "fee-1", name: "Taxa padrão", percent: 5 };
const feature = { id: "feature-1", name: "Feature X", active: true };
const billingSettings = { id: "settings-1", defaultCurrency: "BRL" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAdminReferrals", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca todos os referrals administrativos com sucesso", async () => {
		mockAdminListAllReferrals.mockResolvedValueOnce([referral] as never);
		const { result } = renderHook(() => useAdminReferrals(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([referral]);
		expect(mockAdminListAllReferrals).toHaveBeenCalledTimes(1);
	});
});

describe("useMyReferralStats", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca as estatísticas de referral do usuário logado com sucesso", async () => {
		mockMyStats.mockResolvedValueOnce(referralStats as never);
		const { result } = renderHook(() => useMyReferralStats(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(referralStats);
		expect(mockMyStats).toHaveBeenCalledTimes(1);
	});
});

describe("useRegenerateCode", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama regenerate para gerar um novo código", async () => {
		mockRegenerate.mockResolvedValueOnce(referralCode as never);
		const { result } = renderHook(() => useRegenerateCode(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate();
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockRegenerate).toHaveBeenCalledTimes(1);
	});
});

describe("useSystemFees", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a lista de taxas do sistema com sucesso", async () => {
		mockListAllFees.mockResolvedValueOnce([systemFee] as never);
		const { result } = renderHook(() => useSystemFees(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([systemFee]);
		expect(mockListAllFees).toHaveBeenCalledTimes(1);
	});
});

describe("useUpdateSystemFee", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama update com id e dados corretos", async () => {
		mockUpdateFee.mockResolvedValueOnce(systemFee as never);
		const { result } = renderHook(() => useUpdateSystemFee(), {
			wrapper: wrapper(),
		});
		const data = { percent: 8 };
		await act(async () => {
			result.current.mutate({ id: "fee-1", data } as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateFee).toHaveBeenCalledWith("fee-1", data);
	});
});

describe("useCreateFeature", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama create com os dados corretos", async () => {
		mockCreateFeature.mockResolvedValueOnce(feature as never);
		const { result } = renderHook(() => useCreateFeature(), {
			wrapper: wrapper(),
		});
		const data = { name: "Feature X", description: "Descrição" };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCreateFeature).toHaveBeenCalledWith(data);
	});
});

describe("useDeleteFeature", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama delete com o id correto", async () => {
		mockDeleteFeature.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteFeature(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("feature-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDeleteFeature).toHaveBeenCalledWith("feature-1");
	});
});

describe("useUpdateFeature", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama update com id e dados corretos", async () => {
		mockUpdateFeature.mockResolvedValueOnce(feature as never);
		const { result } = renderHook(() => useUpdateFeature(), {
			wrapper: wrapper(),
		});
		const data = { name: "Feature Y" };
		await act(async () => {
			result.current.mutate({ id: "feature-1", data } as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateFeature).toHaveBeenCalledWith("feature-1", data);
	});
});

describe("useUpdateBillingSettings", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama update com os dados corretos", async () => {
		mockUpdateSettings.mockResolvedValueOnce(billingSettings as never);
		const { result } = renderHook(() => useUpdateBillingSettings(), {
			wrapper: wrapper(),
		});
		const data = { defaultCurrency: "USD" };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateSettings).toHaveBeenCalledWith(data);
	});
});
