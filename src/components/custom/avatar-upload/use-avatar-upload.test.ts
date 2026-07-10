import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockLoadUser = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/store/useUserStore", () => ({
	useUserStore: vi.fn(),
}));

import { toast } from "sonner";
import { api } from "@/config/api";
import { useUserStore } from "@/store/useUserStore";
import { useAvatarUpload } from "./use-avatar-upload";

const mockApiPost = vi.mocked(api.post);
const mockUseUserStore = vi.mocked(useUserStore);

function createFile(kind: "image" | "other" = "image") {
	return kind === "image"
		? new File(["fake-image-content"], "avatar.png", { type: "image/png" })
		: new File(["fake-pdf-content"], "documento.pdf", {
				type: "application/pdf",
			});
}

describe("useAvatarUpload", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseUserStore.mockReturnValue({ loadUser: mockLoadUser } as never);
		mockLoadUser.mockResolvedValue(undefined);
	});

	it("inicia com uploading falso", () => {
		const { result } = renderHook(() => useAvatarUpload());
		expect(result.current.uploading).toBe(false);
	});

	it("rejeita arquivo que não é imagem e não chama a API", async () => {
		const { result } = renderHook(() => useAvatarUpload());

		await act(async () => {
			await result.current.uploadAvatar(createFile("other"));
		});

		expect(toast.error).toHaveBeenCalledWith("Selecione uma imagem válida.");
		expect(mockApiPost).not.toHaveBeenCalled();
		expect(result.current.uploading).toBe(false);
	});

	it("envia a imagem via FormData e atualiza o usuário em caso de sucesso", async () => {
		mockApiPost.mockResolvedValueOnce({ data: {} } as never);
		const { result } = renderHook(() => useAvatarUpload());

		await act(async () => {
			await result.current.uploadAvatar(createFile());
		});

		expect(mockApiPost).toHaveBeenCalledWith(
			"/users/me/avatar",
			expect.any(FormData),
			expect.objectContaining({
				headers: { "Content-Type": "multipart/form-data" },
			}),
		);
		const sentFormData = mockApiPost.mock.calls[0][1] as FormData;
		expect(sentFormData.get("file")).toBeInstanceOf(File);
		expect(mockLoadUser).toHaveBeenCalledTimes(1);
		expect(toast.success).toHaveBeenCalledWith("Foto atualizada com sucesso!");
		expect(result.current.uploading).toBe(false);
	});

	it("liga uploading durante o envio e desliga ao final", async () => {
		let resolvePost: (value: unknown) => void = () => {};
		mockApiPost.mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					resolvePost = resolve;
				}),
		);
		const { result } = renderHook(() => useAvatarUpload());

		let uploadPromise: Promise<void>;
		act(() => {
			uploadPromise = result.current.uploadAvatar(createFile());
		});

		expect(result.current.uploading).toBe(true);

		await act(async () => {
			resolvePost({ data: {} });
			await uploadPromise;
		});

		expect(result.current.uploading).toBe(false);
	});

	it("mostra erro e desliga uploading quando a API falha", async () => {
		mockApiPost.mockRejectedValueOnce(new Error("Erro de rede"));
		const { result } = renderHook(() => useAvatarUpload());

		await act(async () => {
			await result.current.uploadAvatar(createFile());
		});

		expect(toast.error).toHaveBeenCalledWith("Erro ao enviar a foto.");
		expect(result.current.uploading).toBe(false);
	});
});
