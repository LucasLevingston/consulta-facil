import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
  api: { post: vi.fn() },
}));

import { api } from "@/config/api";
import { registerApi } from "@/lib/api/auth/register.api";

const mockPost = vi.mocked(api.post);

const baseInput = {
  name: "João Silva",
  email: "joao@test.com",
  password: "Senha@123",
  confirmPassword: "Senha@123",
  cpf: "12345678901",
};

describe("registerApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("chama POST /auth/register e retorna os dados do usuário criado", async () => {
    const responseData = {
      id: "u-1",
      name: baseInput.name,
      email: baseInput.email,
      role: "USER" as const,
    };
    mockPost.mockResolvedValueOnce({ data: responseData });

    const result = await registerApi(baseInput);

    expect(mockPost).toHaveBeenCalledWith("/auth/register", baseInput);
    expect(result).toEqual(responseData);
  });

  it("propaga o erro quando o e-mail já está em uso", async () => {
    mockPost.mockRejectedValueOnce(new Error("Conflict"));

    await expect(registerApi(baseInput)).rejects.toThrow("Conflict");
  });
});
