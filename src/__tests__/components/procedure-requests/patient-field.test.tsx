import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

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
			aria-label="select"
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
		disabled,
	}: {
		children: React.ReactNode;
		value: string;
		disabled?: boolean;
	}) => (
		<option value={value} disabled={disabled}>
			{children}
		</option>
	),
}));

import { CreateProcedureRequestPatientField } from "@/components/procedure-requests/CreateProcedureRequestPatientField";

const patientFieldSchema = z.object({
	patientId: z.string().min(1, "Paciente é obrigatório"),
});

function PatientFieldWrapper({
	patients,
}: {
	patients: { id: string; name: string }[];
}) {
	const form = useForm<{ patientId: string }>({
		resolver: zodResolver(patientFieldSchema),
		defaultValues: { patientId: "" },
	});
	return (
		<form onSubmit={form.handleSubmit(() => {})}>
			<CreateProcedureRequestPatientField
				form={form as never}
				patients={patients}
			/>
			<button type="submit">enviar</button>
		</form>
	);
}

describe("CreateProcedureRequestPatientField", () => {
	it("renderiza input de texto quando não há pacientes", () => {
		render(<PatientFieldWrapper patients={[]} />);
		expect(screen.getByPlaceholderText("ID do paciente")).toBeInTheDocument();
	});

	it("renderiza select de pacientes quando há pacientes cadastrados", () => {
		render(
			<PatientFieldWrapper patients={[{ id: "p-1", name: "João Paciente" }]} />,
		);
		expect(screen.getByText("João Paciente")).toBeInTheDocument();
	});

	it("exibe mensagem de erro quando paciente não é selecionado", async () => {
		render(<PatientFieldWrapper patients={[]} />);
		await userEvent.click(screen.getByText("enviar"));
		expect(
			await screen.findByText("Paciente é obrigatório"),
		).toBeInTheDocument();
	});
});
