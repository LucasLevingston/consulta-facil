import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("next/navigation", () => ({
	useSearchParams: vi.fn(),
	useRouter: vi.fn(),
	usePathname: vi.fn(),
}));
vi.mock("@/features/dependents", () => ({
	useDeleteDependent: vi.fn(),
}));
vi.mock("@/features/messaging", () => ({
	useConversations: vi.fn(),
}));
vi.mock("@/features/billing", () => ({
	useSystemFees: vi.fn(),
	useUpdateSystemFee: vi.fn(),
	useFeatures: vi.fn(),
	useCreateFeature: vi.fn(),
	useDeleteFeature: vi.fn(),
}));

import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
	useCreateFeature,
	useDeleteFeature,
	useFeatures,
	useSystemFees,
	useUpdateSystemFee,
} from "@/features/billing";
import { useBillingFeaturesPage } from "@/features/billing/hooks/use-billing-features-page";
import { useSystemFeesPage } from "@/features/billing/hooks/use-system-fees-page";
import { useDeleteDependent } from "@/features/dependents";
import { useDependentsPage } from "@/features/dependents/hooks/use-dependents-page";
import { useConversations } from "@/features/messaging";
import { useMessagesPage } from "@/features/messaging/hooks/use-messages-page";

const mockUseSearchParams = vi.mocked(useSearchParams);
const mockUseSystemFees = vi.mocked(useSystemFees);
const mockUseUpdateSystemFee = vi.mocked(useUpdateSystemFee);
const mockUseFeatures = vi.mocked(useFeatures);
const mockUseCreateFeature = vi.mocked(useCreateFeature);
const mockUseDeleteFeature = vi.mocked(useDeleteFeature);
const mockUseDeleteDependent = vi.mocked(useDeleteDependent);
const mockUseConversations = vi.mocked(useConversations);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("useDependentsPage", () => {
	beforeEach(() => {
		mockUseDeleteDependent.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);
	});

	it("inicia com diálogo fechado e nenhum dependente em edição", () => {
		const { result } = renderHook(() => useDependentsPage());
		expect(result.current.dialogOpen).toBe(false);
		expect(result.current.editing).toBeNull();
	});

	it("openCreate abre o diálogo sem dependente em edição", () => {
		const { result } = renderHook(() => useDependentsPage());
		act(() => result.current.openCreate());
		expect(result.current.dialogOpen).toBe(true);
		expect(result.current.editing).toBeNull();
	});

	it("openEdit abre o diálogo com o dependente selecionado", () => {
		const { result } = renderHook(() => useDependentsPage());
		const dep = { id: "d-1", name: "João" };
		act(() => result.current.openEdit(dep as never));
		expect(result.current.dialogOpen).toBe(true);
		expect(result.current.editing).toEqual(dep);
	});

	it("handleDelete chama a mutation e mostra toast de sucesso", async () => {
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockUseDeleteDependent.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		const { result } = renderHook(() => useDependentsPage());
		await act(async () => {
			await result.current.handleDelete("d-1");
		});
		expect(mutateAsync).toHaveBeenCalledWith("d-1");
		expect(toast.success).toHaveBeenCalledWith("Dependente removido.");
	});

	it("handleDelete mostra toast de erro quando a mutation falha", async () => {
		const mutateAsync = vi.fn().mockRejectedValue(new Error("fail"));
		mockUseDeleteDependent.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		const { result } = renderHook(() => useDependentsPage());
		await act(async () => {
			await result.current.handleDelete("d-1");
		});
		expect(toast.error).toHaveBeenCalledWith("Erro ao remover dependente.");
	});

	it("deleting reflete o estado da mutation", () => {
		mockUseDeleteDependent.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: true,
		} as never);
		const { result } = renderHook(() => useDependentsPage());
		expect(result.current.deleting).toBe(true);
	});
});

describe("useMessagesPage", () => {
	const conversations = [
		{ id: "c-1", name: "Conversa 1" },
		{ id: "c-2", name: "Conversa 2" },
	];

	beforeEach(() => {
		mockUseSearchParams.mockReturnValue(new URLSearchParams() as never);
		mockUseConversations.mockReturnValue({ data: conversations } as never);
	});

	it("inicia sem conversa selecionada quando não há parâmetro 'c'", () => {
		const { result } = renderHook(() => useMessagesPage());
		expect(result.current.selectedId).toBeNull();
		expect(result.current.selected).toBeUndefined();
		expect(result.current.mobileShowThread).toBe(false);
	});

	it("inicia com a conversa selecionada a partir do parâmetro 'c'", () => {
		mockUseSearchParams.mockReturnValue(new URLSearchParams("c=c-2") as never);
		const { result } = renderHook(() => useMessagesPage());
		expect(result.current.selectedId).toBe("c-2");
		expect(result.current.selected).toEqual(conversations[1]);
		expect(result.current.mobileShowThread).toBe(true);
	});

	it("handleSelect atualiza selectedId e exibe a thread no mobile", () => {
		const { result } = renderHook(() => useMessagesPage());
		act(() => result.current.handleSelect("c-1"));
		expect(result.current.selectedId).toBe("c-1");
		expect(result.current.selected).toEqual(conversations[0]);
		expect(result.current.mobileShowThread).toBe(true);
	});

	it("retorna a lista de conversas do useConversations", () => {
		const { result } = renderHook(() => useMessagesPage());
		expect(result.current.conversations).toEqual(conversations);
	});
});

describe("useSystemFeesPage", () => {
	const fee = { id: "f-1", fixedFee: 10, percentageFee: 5 };

	beforeEach(() => {
		mockUseSystemFees.mockReturnValue({
			data: [fee],
			isLoading: false,
		} as never);
		mockUseUpdateSystemFee.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		} as never);
	});

	it("inicia sem edição e campos vazios", () => {
		const { result } = renderHook(() => useSystemFeesPage());
		expect(result.current.editing).toBeNull();
		expect(result.current.fixedFee).toBe("");
		expect(result.current.percentageFee).toBe("");
		expect(result.current.fees).toEqual([fee]);
	});

	it("startEdit preenche os campos com os valores da taxa selecionada", () => {
		const { result } = renderHook(() => useSystemFeesPage());
		act(() => result.current.startEdit(fee as never));
		expect(result.current.editing).toBe("f-1");
		expect(result.current.fixedFee).toBe("10");
		expect(result.current.percentageFee).toBe("5");
	});

	it("handleSave chama a mutation com os valores numéricos e limpa a edição ao concluir", () => {
		const mutate = vi.fn((_data, opts) => opts?.onSuccess?.());
		mockUseUpdateSystemFee.mockReturnValue({
			mutate,
			isPending: false,
		} as never);
		const { result } = renderHook(() => useSystemFeesPage());
		act(() => result.current.startEdit(fee as never));
		act(() => result.current.setFixedFee("20"));
		act(() => result.current.setPercentageFee("8"));
		act(() => result.current.handleSave("f-1"));
		expect(mutate).toHaveBeenCalledWith(
			{ id: "f-1", data: { fixedFee: 20, percentageFee: 8 } },
			expect.any(Object),
		);
		expect(result.current.editing).toBeNull();
	});

	it("cancelEdit limpa a edição em andamento", () => {
		const { result } = renderHook(() => useSystemFeesPage());
		act(() => result.current.startEdit(fee as never));
		act(() => result.current.cancelEdit());
		expect(result.current.editing).toBeNull();
	});

	it("saving reflete o estado da mutation", () => {
		mockUseUpdateSystemFee.mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		} as never);
		const { result } = renderHook(() => useSystemFeesPage());
		expect(result.current.saving).toBe(true);
	});
});

describe("useBillingFeaturesPage", () => {
	const feature = { id: "ft-1", key: "chat", name: "Chat" };

	beforeEach(() => {
		mockUseFeatures.mockReturnValue({
			data: [feature],
			isLoading: false,
		} as never);
		mockUseCreateFeature.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		} as never);
		mockUseDeleteFeature.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		} as never);
	});

	it("inicia com os campos newKey e newName vazios", () => {
		const { result } = renderHook(() => useBillingFeaturesPage());
		expect(result.current.newKey).toBe("");
		expect(result.current.newName).toBe("");
		expect(result.current.features).toEqual([feature]);
	});

	it("handleCreate não chama a mutation quando newKey ou newName estão vazios", () => {
		const mutate = vi.fn();
		mockUseCreateFeature.mockReturnValue({ mutate, isPending: false } as never);
		const { result } = renderHook(() => useBillingFeaturesPage());
		act(() => result.current.handleCreate());
		expect(mutate).not.toHaveBeenCalled();
	});

	it("handleCreate chama a mutation e limpa os campos ao concluir com sucesso", () => {
		const mutate = vi.fn((_data, opts) => opts?.onSuccess?.());
		mockUseCreateFeature.mockReturnValue({ mutate, isPending: false } as never);
		const { result } = renderHook(() => useBillingFeaturesPage());
		act(() => result.current.setNewKey("premium"));
		act(() => result.current.setNewName("Premium"));
		act(() => result.current.handleCreate());
		expect(mutate).toHaveBeenCalledWith(
			{ key: "premium", name: "Premium" },
			expect.any(Object),
		);
		expect(result.current.newKey).toBe("");
		expect(result.current.newName).toBe("");
	});

	it("handleDelete chama a mutation de exclusão com o id", () => {
		const mutate = vi.fn();
		mockUseDeleteFeature.mockReturnValue({ mutate, isPending: false } as never);
		const { result } = renderHook(() => useBillingFeaturesPage());
		act(() => result.current.handleDelete("ft-1"));
		expect(mutate).toHaveBeenCalledWith("ft-1");
	});

	it("creating e deleting refletem o estado das mutations", () => {
		mockUseCreateFeature.mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		} as never);
		mockUseDeleteFeature.mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		} as never);
		const { result } = renderHook(() => useBillingFeaturesPage());
		expect(result.current.creating).toBe(true);
		expect(result.current.deleting).toBe(true);
	});
});
