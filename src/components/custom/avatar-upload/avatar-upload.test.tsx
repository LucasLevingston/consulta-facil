import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mocks dos hooks usados internamente por AvatarUpload
const mockUploadAvatar = vi.hoisted(() => vi.fn());
const mockUseUserStore = vi.hoisted(() => vi.fn());
const mockUseAvatarUpload = vi.hoisted(() => vi.fn());

vi.mock("@/features/auth", () => ({
	useUserStore: mockUseUserStore,
}));
vi.mock("./use-avatar-upload", () => ({
	useAvatarUpload: mockUseAvatarUpload,
}));

import { AvatarUpload } from "./avatar-upload";

describe("AvatarUpload", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseUserStore.mockReturnValue({
			user: { name: "Maria Silva", email: "maria@teste.com", imageUrl: null },
		});
		mockUseAvatarUpload.mockReturnValue({
			uploading: false,
			uploadAvatar: mockUploadAvatar,
		});
	});

	it("renderiza as iniciais do nome do usuário quando não está enviando", () => {
		render(<AvatarUpload />);
		expect(screen.getByText("MS")).toBeInTheDocument();
	});

	it("renderiza as iniciais do e-mail quando o usuário não tem nome", () => {
		mockUseUserStore.mockReturnValue({
			user: { name: null, email: "joao@teste.com", imageUrl: null },
		});
		render(<AvatarUpload />);
		expect(screen.getByText("JO")).toBeInTheDocument();
	});

	it("desabilita o botão da câmera enquanto o upload está em andamento", () => {
		mockUseAvatarUpload.mockReturnValue({
			uploading: true,
			uploadAvatar: mockUploadAvatar,
		});
		render(<AvatarUpload />);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("chama uploadAvatar ao selecionar um arquivo no input escondido", async () => {
		mockUploadAvatar.mockResolvedValue(undefined);
		const { container } = render(<AvatarUpload />);
		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		expect(input).toBeInTheDocument();

		const file = new File(["conteudo"], "foto.png", { type: "image/png" });
		await userEvent.upload(input, file);

		expect(mockUploadAvatar).toHaveBeenCalledWith(file);
	});

	it("abre o seletor de arquivo ao clicar no botão da câmera", async () => {
		const { container } = render(<AvatarUpload />);
		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		const clickSpy = vi.spyOn(input, "click");

		await userEvent.click(screen.getByRole("button"));

		expect(clickSpy).toHaveBeenCalledTimes(1);
	});
});
