import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		value,
		onValueChange,
	}: {
		children: React.ReactNode;
		value?: string;
		onValueChange?: (v: string) => void;
	}) => (
		<select
			aria-label="modalidade"
			value={value ?? ""}
			onChange={(e) => onValueChange?.(e.target.value)}
		>
			<option value="" />
			{children}
		</select>
	),
	SelectTrigger: () => null,
	SelectValue: () => null,
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <option value={value}>{children}</option>,
}));

const { scheduleMutateAsync, toastSuccess, toastError } = vi.hoisted(() => ({
	scheduleMutateAsync: vi.fn(),
	toastSuccess: vi.fn(),
	toastError: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: { success: toastSuccess, error: toastError },
}));
vi.mock("@/features/procedure-requests", async () => {
	const { z } = await import("zod");
	return {
		scheduleProcedureRequestSchema: z.object({
			scheduledAt: z.string().min(1, "Data e hora são obrigatórias"),
			modality: z.enum(["IN_PERSON", "ONLINE"]).optional(),
		}),
		useScheduleProcedureRequest: vi.fn(() => ({
			mutateAsync: scheduleMutateAsync,
			isPending: false,
		})),
	};
});

import { ProcedureModalitySelect } from "@/components/procedure-requests/ProcedureModalitySelect";
import { ScheduleProcedureRequestForm } from "@/components/procedure-requests/ScheduleProcedureRequestForm";
import { useScheduleProcedureRequest } from "@/features/procedure-requests";

describe("ProcedureModalitySelect", () => {
	it("renderiza as opções Presencial e Online", () => {
		render(<ProcedureModalitySelect onChange={vi.fn()} />);
		expect(screen.getByText("Presencial")).toBeInTheDocument();
		expect(screen.getByText("Online")).toBeInTheDocument();
	});

	it("chama onChange com o valor selecionado", async () => {
		const onChange = vi.fn();
		render(<ProcedureModalitySelect onChange={onChange} />);
		await userEvent.selectOptions(screen.getByRole("combobox"), "ONLINE");
		expect(onChange).toHaveBeenCalledWith("ONLINE");
	});

	it("reflete o valor selecionado no select", () => {
		render(<ProcedureModalitySelect value="IN_PERSON" onChange={vi.fn()} />);
		expect(screen.getByRole("combobox")).toHaveValue("IN_PERSON");
	});
});

describe("ScheduleProcedureRequestForm", () => {
	beforeEach(() => {
		scheduleMutateAsync.mockReset();
		toastSuccess.mockReset();
		toastError.mockReset();
		vi.mocked(useScheduleProcedureRequest).mockReturnValue({
			mutateAsync: scheduleMutateAsync,
			isPending: false,
		} as never);
	});

	it("renderiza o nome do serviço informado", () => {
		render(
			<ScheduleProcedureRequestForm
				requestId="req-1"
				serviceName="Ultrassom"
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Ultrassom")).toBeInTheDocument();
	});

	it("exibe erro quando data e hora não são preenchidas", async () => {
		render(
			<ScheduleProcedureRequestForm
				requestId="req-1"
				serviceName="Ultrassom"
				onClose={vi.fn()}
			/>,
		);
		await userEvent.click(screen.getByText("Confirmar agendamento"));
		expect(
			await screen.findByText("Data e hora são obrigatórias"),
		).toBeInTheDocument();
	});

	it("chama onClose ao clicar em Cancelar", async () => {
		const onClose = vi.fn();
		render(
			<ScheduleProcedureRequestForm
				requestId="req-1"
				serviceName="Ultrassom"
				onClose={onClose}
			/>,
		);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("preenche data, modalidade e envia a mutation de agendamento correta", async () => {
		scheduleMutateAsync.mockResolvedValueOnce(undefined);
		const onClose = vi.fn();
		render(
			<ScheduleProcedureRequestForm
				requestId="req-1"
				serviceName="Ultrassom"
				onClose={onClose}
			/>,
		);

		const dateInput = screen.getByLabelText("Data e hora *");
		fireEvent.change(dateInput, { target: { value: "2026-08-10T10:30" } });
		await userEvent.selectOptions(screen.getByRole("combobox"), "ONLINE");
		await userEvent.click(screen.getByText("Confirmar agendamento"));

		await waitFor(() => {
			expect(scheduleMutateAsync).toHaveBeenCalledTimes(1);
		});
		const call = scheduleMutateAsync.mock.calls[0][0];
		expect(call.requestId).toBe("req-1");
		expect(call.data.modality).toBe("ONLINE");
		expect(typeof call.data.scheduledAt).toBe("string");
		expect(toastSuccess).toHaveBeenCalledWith("Procedimento agendado!");
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("mostra toast de erro quando o agendamento falha", async () => {
		scheduleMutateAsync.mockRejectedValueOnce(new Error("falha"));
		render(
			<ScheduleProcedureRequestForm
				requestId="req-1"
				serviceName="Ultrassom"
				onClose={vi.fn()}
			/>,
		);

		fireEvent.change(screen.getByLabelText("Data e hora *"), {
			target: { value: "2026-08-10T10:30" },
		});
		await userEvent.click(screen.getByText("Confirmar agendamento"));

		await waitFor(() => {
			expect(toastError).toHaveBeenCalledWith("Erro ao agendar procedimento.");
		});
	});
});
