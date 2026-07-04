import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => (values: unknown) => ({ values, errors: {} })),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/features/clinics", () => ({
	inviteReceptionistSchema: {},
	useClinicReceptionists: vi.fn(),
	useInviteReceptionist: vi.fn(),
	useRemoveReceptionist: vi.fn(),
}));
vi.mock("@/components/custom/clinic/ReceptionistInviteForm", () => ({
	ReceptionistInviteForm: ({
		onSubmit,
		onCancel,
	}: {
		onSubmit: (e?: unknown) => void;
		onCancel: () => void;
	}) => (
		<div>
			<button type="button" onClick={() => onSubmit()}>
				submeter-convite
			</button>
			<button type="button" onClick={onCancel}>
				cancelar-convite
			</button>
		</div>
	),
}));
vi.mock("@/components/custom/clinic/ReceptionistList", () => ({
	ReceptionistList: ({
		receptionists,
		onRemove,
	}: {
		receptionists: { id: string; name?: string | null }[];
		onRemove: (id: string) => void;
	}) => (
		<div>
			{receptionists.map((r) => (
				<div key={r.id}>
					{r.name}
					<button type="button" onClick={() => onRemove(r.id)}>
						remover-{r.id}
					</button>
				</div>
			))}
		</div>
	),
}));

import { toast } from "sonner";
import { ReceptionistsSection } from "@/components/custom/clinic/ReceptionistsSection";
import {
	useClinicReceptionists,
	useInviteReceptionist,
	useRemoveReceptionist,
} from "@/features/clinics";

const mockUseClinicReceptionists = vi.mocked(useClinicReceptionists);
const mockUseInviteReceptionist = vi.mocked(useInviteReceptionist);
const mockUseRemoveReceptionist = vi.mocked(useRemoveReceptionist);

beforeEach(() => {
	vi.clearAllMocks();
	mockUseInviteReceptionist.mockReturnValue({
		mutateAsync: vi.fn().mockResolvedValue(undefined),
	} as never);
	mockUseRemoveReceptionist.mockReturnValue({
		mutateAsync: vi.fn().mockResolvedValue(undefined),
	} as never);
});

describe("ReceptionistsSection", () => {
	it("não renderiza nada enquanto está carregando", () => {
		mockUseClinicReceptionists.mockReturnValue({
			data: undefined,
			isLoading: true,
		} as never);
		const { container } = render(<ReceptionistsSection clinicId="c-1" />);
		expect(container).toBeEmptyDOMElement();
	});

	it("mostra a mensagem de lista vazia quando não há recepcionistas", () => {
		mockUseClinicReceptionists.mockReturnValue({
			data: [],
			isLoading: false,
		} as never);
		render(<ReceptionistsSection clinicId="c-1" />);
		expect(
			screen.getByText("Nenhum recepcionista cadastrado."),
		).toBeInTheDocument();
	});

	it("renderiza a lista de recepcionistas quando há itens", () => {
		mockUseClinicReceptionists.mockReturnValue({
			data: [{ id: "r-1", name: "Ana", email: "ana@email.com" }],
			isLoading: false,
		} as never);
		render(<ReceptionistsSection clinicId="c-1" />);
		expect(screen.getByText("Ana")).toBeInTheDocument();
		expect(
			screen.queryByText("Nenhum recepcionista cadastrado."),
		).not.toBeInTheDocument();
	});

	it("mostra o formulário de convite ao clicar em 'Adicionar' e esconde ao cancelar", async () => {
		const user = userEvent.setup();
		mockUseClinicReceptionists.mockReturnValue({
			data: [],
			isLoading: false,
		} as never);
		render(<ReceptionistsSection clinicId="c-1" />);

		await user.click(screen.getByText("Adicionar"));
		expect(screen.getByText("submeter-convite")).toBeInTheDocument();

		await user.click(screen.getByText("cancelar-convite"));
		expect(screen.queryByText("submeter-convite")).not.toBeInTheDocument();
	});

	it("chama invite e mostra toast de sucesso ao submeter o convite", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockUseInviteReceptionist.mockReturnValue({ mutateAsync } as never);
		mockUseClinicReceptionists.mockReturnValue({
			data: [],
			isLoading: false,
		} as never);
		render(<ReceptionistsSection clinicId="c-1" />);

		await user.click(screen.getByText("Adicionar"));
		await user.click(screen.getByText("submeter-convite"));
		expect(mutateAsync).toHaveBeenCalled();
		expect(toast.success).toHaveBeenCalledWith("Recepcionista adicionado!");
	});

	it("mostra toast de erro quando invite falha", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockRejectedValue(new Error("fail"));
		mockUseInviteReceptionist.mockReturnValue({ mutateAsync } as never);
		mockUseClinicReceptionists.mockReturnValue({
			data: [],
			isLoading: false,
		} as never);
		render(<ReceptionistsSection clinicId="c-1" />);

		await user.click(screen.getByText("Adicionar"));
		await user.click(screen.getByText("submeter-convite"));
		expect(toast.error).toHaveBeenCalledWith(
			"Erro ao adicionar recepcionista.",
		);
	});

	it("chama remove e mostra toast de sucesso ao remover um recepcionista", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockUseRemoveReceptionist.mockReturnValue({ mutateAsync } as never);
		mockUseClinicReceptionists.mockReturnValue({
			data: [{ id: "r-1", name: "Ana", email: "ana@email.com" }],
			isLoading: false,
		} as never);
		render(<ReceptionistsSection clinicId="c-1" />);

		await user.click(screen.getByText("remover-r-1"));
		expect(mutateAsync).toHaveBeenCalledWith("r-1");
		expect(toast.success).toHaveBeenCalledWith("Recepcionista removido.");
	});

	it("mostra toast de erro quando remove falha", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockRejectedValue(new Error("fail"));
		mockUseRemoveReceptionist.mockReturnValue({ mutateAsync } as never);
		mockUseClinicReceptionists.mockReturnValue({
			data: [{ id: "r-1", name: "Ana", email: "ana@email.com" }],
			isLoading: false,
		} as never);
		render(<ReceptionistsSection clinicId="c-1" />);

		await user.click(screen.getByText("remover-r-1"));
		expect(toast.error).toHaveBeenCalledWith("Erro ao remover recepcionista.");
	});
});
