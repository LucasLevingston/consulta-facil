import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => vi.fn()),
}));
vi.mock("next/navigation", () => ({
	useRouter: vi.fn(() => ({ push: vi.fn() })),
}));
vi.mock("@/components/forms/ProfessionalDetails/FormValidation", () => ({
	ProfessionalFormValidation: {},
}));
vi.mock("@/features/professionals", () => ({
	useCreateProfessional: vi.fn(),
	useUpdateProfessional: vi.fn(),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	useCreateProfessional,
	useUpdateProfessional,
} from "@/features/professionals";
import { useProfessionalDetailsForm } from "@/hooks/use-professional-details-form";

const mockRouter = vi.mocked(useRouter);
const mockCreate = vi.mocked(useCreateProfessional);
const mockUpdate = vi.mocked(useUpdateProfessional);

function wrapper() {
	const qc = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

const defaultData = {
	name: "Dra. Ana",
	email: "ana@teste.com",
	profession: "MEDICO",
	specialty: "CARDIOLOGIA",
	licenseNumber: "12345",
} as never;

let pushMock: ReturnType<typeof vi.fn>;
let createMutateAsync: ReturnType<typeof vi.fn>;
let updateMutateAsync: ReturnType<typeof vi.fn>;

beforeEach(() => {
	vi.clearAllMocks();
	pushMock = vi.fn();
	createMutateAsync = vi.fn().mockResolvedValue(undefined);
	updateMutateAsync = vi.fn().mockResolvedValue(undefined);
	mockRouter.mockReturnValue({ push: pushMock } as never);
	mockCreate.mockReturnValue({
		mutateAsync: createMutateAsync,
		isPending: false,
	} as never);
	mockUpdate.mockReturnValue({
		mutateAsync: updateMutateAsync,
		isPending: false,
	} as never);
});

describe("useProfessionalDetailsForm", () => {
	it("retorna form, opções de profissão, opções de especialidade e onSubmit", () => {
		const { result } = renderHook(
			() =>
				useProfessionalDetailsForm({
					userId: "u-1",
					userEmail: "ana@teste.com",
					type: "create",
					defaultData: undefined,
				}),
			{ wrapper: wrapper() },
		);
		expect(result.current.form).toBeDefined();
		expect(typeof result.current.onSubmit).toBe("function");
		expect(result.current.professionOptions.length).toBeGreaterThan(0);
		expect(result.current.professionOptions).toContainEqual({
			value: "MEDICO",
			label: "MEDICO",
		});
	});

	it("inicializa o form com dados de defaultData quando fornecido", () => {
		const { result } = renderHook(
			() =>
				useProfessionalDetailsForm({
					userId: "u-1",
					userEmail: "ana@teste.com",
					type: "edit",
					defaultData,
				}),
			{ wrapper: wrapper() },
		);
		expect(result.current.form.getValues("name")).toBe("Dra. Ana");
		expect(result.current.form.getValues("profession")).toBe("MEDICO");
		expect(result.current.selectedProfession).toBe("MEDICO");
	});

	it("usa userEmail como email padrão quando defaultData não define email", () => {
		const { result } = renderHook(
			() =>
				useProfessionalDetailsForm({
					userId: "u-1",
					userEmail: "fallback@teste.com",
					type: "create",
					defaultData: undefined,
				}),
			{ wrapper: wrapper() },
		);
		expect(result.current.form.getValues("email")).toBe("fallback@teste.com");
	});

	it("calcula specialtyOptions com base na profissão selecionada", () => {
		const { result } = renderHook(
			() =>
				useProfessionalDetailsForm({
					userId: "u-1",
					userEmail: "ana@teste.com",
					type: "edit",
					defaultData,
				}),
			{ wrapper: wrapper() },
		);
		expect(result.current.specialtyOptions).toContainEqual({
			value: "CARDIOLOGIA",
			label: "CARDIOLOGIA",
		});
	});

	it("specialtyOptions fica vazio quando nenhuma profissão está selecionada", () => {
		const { result } = renderHook(
			() =>
				useProfessionalDetailsForm({
					userId: "u-1",
					userEmail: "ana@teste.com",
					type: "create",
					defaultData: undefined,
				}),
			{ wrapper: wrapper() },
		);
		expect(result.current.specialtyOptions).toEqual([]);
	});

	it("isPending reflete o estado de criação em andamento", () => {
		mockCreate.mockReturnValue({
			mutateAsync: createMutateAsync,
			isPending: true,
		} as never);
		const { result } = renderHook(
			() =>
				useProfessionalDetailsForm({
					userId: "u-1",
					userEmail: "ana@teste.com",
					type: "create",
					defaultData: undefined,
				}),
			{ wrapper: wrapper() },
		);
		expect(result.current.isPending).toBe(true);
	});

	it("isPending reflete o estado de atualização em andamento", () => {
		mockUpdate.mockReturnValue({
			mutateAsync: updateMutateAsync,
			isPending: true,
		} as never);
		const { result } = renderHook(
			() =>
				useProfessionalDetailsForm({
					userId: "u-1",
					userEmail: "ana@teste.com",
					type: "edit",
					defaultData,
				}),
			{ wrapper: wrapper() },
		);
		expect(result.current.isPending).toBe(true);
	});

	it("onSubmit chama createProfessional e redireciona quando type é create", async () => {
		const { result } = renderHook(
			() =>
				useProfessionalDetailsForm({
					userId: "u-1",
					userEmail: "ana@teste.com",
					type: "create",
					defaultData: undefined,
				}),
			{ wrapper: wrapper() },
		);
		await act(async () => {
			await result.current.onSubmit({
				...defaultData,
				phone: "11999999999",
			} as never);
		});
		expect(createMutateAsync).toHaveBeenCalledWith(
			expect.objectContaining({ name: "Dra. Ana", profession: "MEDICO" }),
		);
		expect(toast.success).toHaveBeenCalledWith("Dados salvos com sucesso!");
		expect(pushMock).toHaveBeenCalledWith("/");
	});

	it("onSubmit chama updateProfessional com professionalId quando type é edit", async () => {
		const { result } = renderHook(
			() =>
				useProfessionalDetailsForm({
					userId: "u-42",
					userEmail: "ana@teste.com",
					type: "edit",
					defaultData,
				}),
			{ wrapper: wrapper() },
		);
		await act(async () => {
			await result.current.onSubmit({
				...defaultData,
				phone: "11999999999",
			} as never);
		});
		expect(updateMutateAsync).toHaveBeenCalledWith(
			expect.objectContaining({
				professionalId: "u-42",
				data: expect.objectContaining({ name: "Dra. Ana" }),
			}),
		);
		expect(toast.success).toHaveBeenCalledWith("Dados salvos com sucesso!");
		expect(pushMock).not.toHaveBeenCalled();
	});

	it("onSubmit exibe toast de erro quando a mutação falha", async () => {
		createMutateAsync.mockRejectedValueOnce(new Error("Falha ao salvar"));
		const { result } = renderHook(
			() =>
				useProfessionalDetailsForm({
					userId: "u-1",
					userEmail: "ana@teste.com",
					type: "create",
					defaultData: undefined,
				}),
			{ wrapper: wrapper() },
		);
		await act(async () => {
			await result.current.onSubmit({
				...defaultData,
				phone: "11999999999",
			} as never);
		});
		expect(toast.error).toHaveBeenCalledWith("Falha ao salvar");
	});

	it("onSubmit exibe mensagem genérica de erro quando o erro não é uma instância de Error", async () => {
		createMutateAsync.mockRejectedValueOnce("erro-string");
		const { result } = renderHook(
			() =>
				useProfessionalDetailsForm({
					userId: "u-1",
					userEmail: "ana@teste.com",
					type: "create",
					defaultData: undefined,
				}),
			{ wrapper: wrapper() },
		);
		await act(async () => {
			await result.current.onSubmit({
				...defaultData,
				phone: "11999999999",
			} as never);
		});
		expect(toast.error).toHaveBeenCalledWith("Erro ao salvar os dados");
	});
});
