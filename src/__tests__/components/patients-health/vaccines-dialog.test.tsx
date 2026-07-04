import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Testes de VaccineDialog: abertura, submit chamando useAddVaccine
// e toast de sucesso/erro.

const { addMutate } = vi.hoisted(() => ({ addMutate: vi.fn() }));

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => vi.fn()),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock("@/features/patients", () => ({
	patientVaccineSchema: {},
	useAddVaccine: () => ({ mutate: addMutate, isPending: false }),
}));

vi.mock("@/components/ui/dialog", () => ({
	Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
		open ? <div>{children}</div> : null,
	DialogContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogTitle: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

vi.mock("@/components/patients/health/VaccineDialogForm", () => ({
	VaccineDialogForm: ({
		onSubmit,
		onClose,
	}: {
		onSubmit: (data: object) => void;
		onClose: () => void;
	}) => (
		<div>
			<button
				type="button"
				onClick={() =>
					onSubmit({
						vaccineName: "Hepatite B",
						doseNumber: "1ª dose",
						administeredAt: "2026-01-01",
						notes: "",
					})
				}
			>
				submeter
			</button>
			<button type="button" onClick={onClose}>
				fechar
			</button>
		</div>
	),
}));

import { toast } from "sonner";
import { VaccineDialog } from "@/components/patients/health/VaccineDialog";

beforeEach(() => {
	addMutate.mockReset();
});

describe("VaccineDialog", () => {
	it("renderiza nada quando open=false", () => {
		const { container } = render(
			<VaccineDialog open={false} onClose={vi.fn()} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza o título 'Nova vacina' quando open=true", () => {
		render(<VaccineDialog open={true} onClose={vi.fn()} />);
		expect(screen.getByText("Nova vacina")).toBeInTheDocument();
	});

	it("chama add.mutate com os dados do formulário ao submeter", async () => {
		render(<VaccineDialog open={true} onClose={vi.fn()} />);
		await userEvent.click(screen.getByText("submeter"));
		expect(addMutate).toHaveBeenCalledWith(
			{
				vaccineName: "Hepatite B",
				doseNumber: "1ª dose",
				administeredAt: "2026-01-01",
				notes: "",
			},
			expect.any(Object),
		);
	});

	it("mostra toast de sucesso e fecha o dialog ao adicionar com sucesso", async () => {
		addMutate.mockImplementation((_data, opts) => opts.onSuccess());
		const onClose = vi.fn();
		render(<VaccineDialog open={true} onClose={onClose} />);
		await userEvent.click(screen.getByText("submeter"));
		expect(toast.success).toHaveBeenCalledWith("Vacina adicionada!");
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("mostra toast de erro quando adicionar falha", async () => {
		addMutate.mockImplementation((_data, opts) => opts.onError());
		render(<VaccineDialog open={true} onClose={vi.fn()} />);
		await userEvent.click(screen.getByText("submeter"));
		expect(toast.error).toHaveBeenCalledWith("Erro ao adicionar.");
	});

	it("chama onClose ao clicar em fechar", async () => {
		const onClose = vi.fn();
		render(<VaccineDialog open={true} onClose={onClose} />);
		await userEvent.click(screen.getByText("fechar"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
