import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		value,
		disabled,
	}: {
		children: React.ReactNode;
		value?: string;
		disabled?: boolean;
	}) => (
		<div data-testid="select" data-value={value} data-disabled={disabled}>
			{children}
		</div>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectValue: ({ placeholder }: { placeholder?: string }) => (
		<span>{placeholder}</span>
	),
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectGroup: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <div data-value={value}>{children}</div>,
}));

import type { BecomeProfessionalValues } from "@/components/become-professional/BecomeProfessionalForm.schema";
import { BecomeProfessionalFormContent } from "@/components/become-professional/BecomeProfessionalFormContent";

function Harness({
	isPending = false,
	availableSpecialties = [],
	selectedProfession,
	licenseHint = "Ex: CRM/CRN/CRP/CREFITO 123456",
	onSubmit,
}: {
	isPending?: boolean;
	availableSpecialties?: { value: string; label: string }[];
	selectedProfession?: string;
	licenseHint?: string;
	onSubmit: (values: BecomeProfessionalValues) => void;
}) {
	const form = useForm<BecomeProfessionalValues>({
		defaultValues: { licenseNumber: "" },
	});
	return (
		<BecomeProfessionalFormContent
			form={form}
			isPending={isPending}
			availableSpecialties={availableSpecialties}
			selectedProfession={selectedProfession}
			licenseHint={licenseHint}
			onSubmit={form.handleSubmit(onSubmit)}
		/>
	);
}

describe("BecomeProfessionalFormContent", () => {
	it("renderiza os campos Profissão, Especialidade e Número de registro", () => {
		render(<Harness onSubmit={vi.fn()} />);
		expect(screen.getByText("Profissão")).toBeInTheDocument();
		expect(screen.getByText("Especialidade")).toBeInTheDocument();
		expect(screen.getByText("Número de registro")).toBeInTheDocument();
	});

	it("usa o placeholder padrão de especialidade quando nenhuma profissão foi escolhida", () => {
		render(<Harness onSubmit={vi.fn()} />);
		expect(
			screen.getByText("Primeiro selecione a profissão"),
		).toBeInTheDocument();
	});

	it("usa o placeholder de escolha de especialidade quando uma profissão foi escolhida", () => {
		render(
			<Harness
				onSubmit={vi.fn()}
				selectedProfession="MEDICO"
				availableSpecialties={[{ value: "CARDIOLOGIA", label: "Cardiologia" }]}
			/>,
		);
		expect(screen.getByText("Selecione sua especialidade")).toBeInTheDocument();
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("desabilita o select de especialidade quando nenhuma profissão foi escolhida", () => {
		render(<Harness onSubmit={vi.fn()} />);
		const selects = screen.getAllByTestId("select");
		expect(selects[1]).toHaveAttribute("data-disabled", "true");
	});

	it("habilita o select de especialidade quando uma profissão foi escolhida", () => {
		render(<Harness onSubmit={vi.fn()} selectedProfession="MEDICO" />);
		const selects = screen.getAllByTestId("select");
		expect(selects[1]).toHaveAttribute("data-disabled", "false");
	});

	it("usa o texto de licenseHint como placeholder do número de registro", () => {
		render(<Harness onSubmit={vi.fn()} licenseHint="Ex: CRO/SP 123456" />);
		expect(
			screen.getByPlaceholderText("Ex: CRO/SP 123456"),
		).toBeInTheDocument();
	});

	it("mostra 'Enviando...' e desabilita o botão quando isPending=true", () => {
		render(<Harness onSubmit={vi.fn()} isPending={true} />);
		expect(screen.getByText("Enviando...")).toBeInTheDocument();
		expect(screen.getByText("Enviando...").closest("button")).toBeDisabled();
	});

	it("chama onSubmit ao submeter o formulário", async () => {
		const onSubmit = vi.fn();
		const { container } = render(<Harness onSubmit={onSubmit} />);
		const form = container.querySelector("form") as HTMLFormElement;
		fireEvent.submit(form);
		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalled();
		});
	});
});
