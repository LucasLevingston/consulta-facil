import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock(
	"@/features/subscriptions/repositories/subscriptions.repository",
	() => ({
		subscriptionsRepository: {
			getMy: vi.fn(),
			createCheckout: vi.fn(),
			adminListAll: vi.fn(),
			adminCancel: vi.fn(),
		},
	}),
);
vi.mock("@/features/video/repositories/video.repository", () => ({
	videoRepository: {
		createRoom: vi.fn(),
		getToken: vi.fn(),
	},
}));
vi.mock("@/features/dependents/repositories/dependents.repository", () => ({
	dependentsRepository: {
		getMy: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		remove: vi.fn(),
	},
}));

import { useDeleteDependent } from "@/features/dependents/hooks/use-delete-dependent";
import { useUpdateDependent } from "@/features/dependents/hooks/use-update-dependent";
import { dependentsRepository } from "@/features/dependents/repositories/dependents.repository";
import { useAdminCancelSubscription } from "@/features/subscriptions/hooks/use-admin-cancel-subscription";
import { useAdminSubscriptions } from "@/features/subscriptions/hooks/use-admin-subscriptions";
import { useCreateCheckout } from "@/features/subscriptions/hooks/use-create-checkout";
import { useMySubscription } from "@/features/subscriptions/hooks/use-my-subscription";
import { subscriptionsRepository } from "@/features/subscriptions/repositories/subscriptions.repository";
import { useCreateRoom } from "@/features/video/hooks/use-create-room";
import { useRoomToken } from "@/features/video/hooks/use-room-token";
import { videoRepository } from "@/features/video/repositories/video.repository";

const mockGetMy = vi.mocked(subscriptionsRepository.getMy);
const mockCreateCheckout = vi.mocked(subscriptionsRepository.createCheckout);
const mockAdminListAll = vi.mocked(subscriptionsRepository.adminListAll);
const mockAdminCancel = vi.mocked(subscriptionsRepository.adminCancel);

const mockCreateRoom = vi.mocked(videoRepository.createRoom);
const mockGetToken = vi.mocked(videoRepository.getToken);

const mockRemoveDependent = vi.mocked(dependentsRepository.remove);
const mockUpdateDependent = vi.mocked(dependentsRepository.update);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
	};
}

describe("useMySubscription", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a assinatura do usuario logado", async () => {
		const subscription = { id: "sub-1", status: "ACTIVE" };
		mockGetMy.mockResolvedValueOnce(subscription as never);
		const { result } = renderHook(() => useMySubscription(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(subscription);
	});
});

describe("useCreateCheckout", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(window, "location", {
			value: { href: "" },
			writable: true,
		});
	});

	it("chama createCheckout com o planId", async () => {
		mockCreateCheckout.mockResolvedValueOnce({
			checkoutUrl: "https://pay.example.com/checkout",
		} as never);
		const { result } = renderHook(() => useCreateCheckout(), wrapper());
		await act(async () => {
			await result.current.mutateAsync("plan-pro");
		});
		expect(mockCreateCheckout).toHaveBeenCalledWith("plan-pro");
	});

	it("redireciona para o checkoutUrl ao ter sucesso", async () => {
		mockCreateCheckout.mockResolvedValueOnce({
			checkoutUrl: "https://pay.example.com/checkout",
		} as never);
		const { result } = renderHook(() => useCreateCheckout(), wrapper());
		await act(async () => {
			await result.current.mutateAsync("plan-pro");
		});
		expect(window.location.href).toBe("https://pay.example.com/checkout");
	});
});

describe("useAdminSubscriptions", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a lista de assinaturas do admin", async () => {
		const subscriptions = [{ id: "sub-1" }, { id: "sub-2" }];
		mockAdminListAll.mockResolvedValueOnce(subscriptions as never);
		const { result } = renderHook(() => useAdminSubscriptions(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(subscriptions);
	});
});

describe("useAdminCancelSubscription", () => {
	beforeEach(() => vi.clearAllMocks());

	it("cancela a assinatura e invalida a query de admin subscriptions", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		mockAdminCancel.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useAdminCancelSubscription(), {
			wrapper: w,
		});
		await act(async () => {
			await result.current.mutateAsync("sub-1");
		});
		expect(mockAdminCancel).toHaveBeenCalledWith("sub-1");
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["admin", "subscriptions"],
		});
	});
});

describe("useCreateRoom", () => {
	beforeEach(() => vi.clearAllMocks());

	it("cria uma sala de video e invalida a query do appointment", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		const room = { roomId: "room-1", url: "https://video.example.com/room-1" };
		mockCreateRoom.mockResolvedValueOnce(room as never);
		const { result } = renderHook(() => useCreateRoom(), { wrapper: w });
		await act(async () => {
			await result.current.mutateAsync("appt-1");
		});
		expect(mockCreateRoom).toHaveBeenCalledWith("appt-1");
		expect(invalidateSpy).toHaveBeenCalled();
	});
});

describe("useRoomToken", () => {
	beforeEach(() => vi.clearAllMocks());

	it("desabilitado quando appointmentId e null", () => {
		const { result } = renderHook(() => useRoomToken(null), wrapper());
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("busca o token da sala quando appointmentId informado", async () => {
		const room = { roomId: "room-1", token: "tok-123" };
		mockGetToken.mockResolvedValueOnce(room as never);
		const { result } = renderHook(() => useRoomToken("appt-1"), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockGetToken).toHaveBeenCalledWith("appt-1");
		expect(result.current.data).toEqual(room);
	});
});

describe("useDeleteDependent", () => {
	beforeEach(() => vi.clearAllMocks());

	it("remove um dependente e invalida a query de dependentes", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		mockRemoveDependent.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteDependent(), {
			wrapper: w,
		});
		await act(async () => {
			await result.current.mutateAsync("dep-1");
		});
		expect(mockRemoveDependent).toHaveBeenCalledWith("dep-1");
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["dependents", "my"],
		});
	});
});

describe("useUpdateDependent", () => {
	beforeEach(() => vi.clearAllMocks());

	it("atualiza um dependente e invalida a query de dependentes", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		const updated = { id: "dep-1", name: "Maria Atualizada" };
		mockUpdateDependent.mockResolvedValueOnce(updated as never);
		const { result } = renderHook(() => useUpdateDependent(), {
			wrapper: w,
		});
		await act(async () => {
			await result.current.mutateAsync({
				id: "dep-1",
				data: { name: "Maria Atualizada" } as never,
			});
		});
		expect(mockUpdateDependent).toHaveBeenCalledWith("dep-1", {
			name: "Maria Atualizada",
		});
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["dependents", "my"],
		});
	});
});
