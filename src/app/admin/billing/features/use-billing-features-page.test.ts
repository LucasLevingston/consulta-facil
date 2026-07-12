import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./use-features", () => ({
	useFeatures: vi.fn(),
}));
vi.mock("./use-create-feature", () => ({
	useCreateFeature: vi.fn(),
}));
vi.mock("./use-delete-feature", () => ({
	useDeleteFeature: vi.fn(),
}));

import { useBillingFeaturesPage } from "./use-billing-features-page";
import { useCreateFeature } from "./use-create-feature";
import { useDeleteFeature } from "./use-delete-feature";
import { useFeatures } from "./use-features";

const mockUseFeatures = vi.mocked(useFeatures);
const mockUseCreateFeature = vi.mocked(useCreateFeature);
const mockUseDeleteFeature = vi.mocked(useDeleteFeature);

beforeEach(() => {
	vi.clearAllMocks();
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
