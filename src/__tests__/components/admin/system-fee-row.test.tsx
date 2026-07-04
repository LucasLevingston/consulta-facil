import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SystemFeeRow } from "@/components/admin/billing/SystemFeeRow";
import { Table, TableBody } from "@/components/ui/table";
import type { SystemFeeResponse } from "@/features/billing";

const baseFee = {
	id: "fee-1",
	paymentType: "CONSULTATION",
	fixedFee: 2.5,
	percentageFee: 0.05,
	active: true,
} as SystemFeeResponse;

function renderRow(
	props: Partial<React.ComponentProps<typeof SystemFeeRow>> = {},
) {
	const base: React.ComponentProps<typeof SystemFeeRow> = {
		fee: baseFee,
		isEditing: false,
		fixedFee: "2.50",
		setFixedFee: vi.fn(),
		percentageFee: "0.05",
		setPercentageFee: vi.fn(),
		onSave: vi.fn(),
		onEdit: vi.fn(),
		onCancel: vi.fn(),
		saving: false,
		...props,
	};
	return render(
		<Table>
			<TableBody>
				<SystemFeeRow {...base} />
			</TableBody>
		</Table>,
	);
}

describe("SystemFeeRow", () => {
	it("renderiza o label do tipo de pagamento", () => {
		renderRow();
		expect(screen.getByText("Consulta")).toBeInTheDocument();
	});

	it("renderiza os valores formatados quando não está em edição", () => {
		renderRow({ fee: { ...baseFee, fixedFee: 2.5, percentageFee: 0.05 } });
		expect(screen.getByText("R$ 2,50")).toBeInTheDocument();
		expect(screen.getByText("5.00%")).toBeInTheDocument();
	});

	it("mostra o badge Ativo quando a taxa está ativa", () => {
		renderRow({ fee: { ...baseFee, active: true } });
		expect(screen.getByText("Ativo")).toBeInTheDocument();
	});

	it("mostra o badge Inativo quando a taxa não está ativa", () => {
		renderRow({ fee: { ...baseFee, active: false } });
		expect(screen.getByText("Inativo")).toBeInTheDocument();
	});

	it("mostra o botão Editar quando não está em edição", () => {
		renderRow({ isEditing: false });
		expect(screen.getByRole("button", { name: "Editar" })).toBeInTheDocument();
	});

	it("chama onEdit ao clicar em Editar", async () => {
		const user = userEvent.setup();
		const onEdit = vi.fn();
		renderRow({ isEditing: false, onEdit });
		await user.click(screen.getByRole("button", { name: "Editar" }));
		expect(onEdit).toHaveBeenCalledTimes(1);
	});

	it("mostra os inputs de edição e os botões Salvar/Cancelar quando isEditing=true", () => {
		renderRow({ isEditing: true });
		expect(screen.getAllByRole("spinbutton")).toHaveLength(2);
		expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Cancelar" }),
		).toBeInTheDocument();
	});

	it("chama setFixedFee ao digitar no input de taxa fixa", async () => {
		const user = userEvent.setup();
		const setFixedFee = vi.fn();
		renderRow({ isEditing: true, fixedFee: "", setFixedFee });
		const inputs = screen.getAllByRole("spinbutton");
		await user.type(inputs[0], "3");
		expect(setFixedFee).toHaveBeenCalledWith("3");
	});

	it("chama onSave ao clicar em Salvar e desabilita o botão quando saving=true", async () => {
		const user = userEvent.setup();
		const onSave = vi.fn();
		const { rerender } = renderRow({ isEditing: true, onSave, saving: false });
		await user.click(screen.getByRole("button", { name: "Salvar" }));
		expect(onSave).toHaveBeenCalledTimes(1);

		rerender(
			<Table>
				<TableBody>
					<SystemFeeRow
						fee={baseFee}
						isEditing={true}
						fixedFee="2.50"
						setFixedFee={vi.fn()}
						percentageFee="0.05"
						setPercentageFee={vi.fn()}
						onSave={onSave}
						onEdit={vi.fn()}
						onCancel={vi.fn()}
						saving={true}
					/>
				</TableBody>
			</Table>,
		);
		expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
	});

	it("chama onCancel ao clicar em Cancelar", async () => {
		const user = userEvent.setup();
		const onCancel = vi.fn();
		renderRow({ isEditing: true, onCancel });
		await user.click(screen.getByRole("button", { name: "Cancelar" }));
		expect(onCancel).toHaveBeenCalledTimes(1);
	});
});
