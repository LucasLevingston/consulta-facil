import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// PatientsGrid é um componente de apresentação puro: recebe `patients` via
// props e não chama usePatientsPage diretamente (o hook fica na página que
// o consome, já coberto por src/__tests__/hooks-forms-gaps/use-pages-lists.test.ts).
import { PatientsGrid } from "@/components/patients/PatientsGrid";
import type { PatientSummary } from "@/lib/api/patients/patient-profile.api.types";

function makePatient(overrides: Partial<PatientSummary> = {}): PatientSummary {
	return {
		id: "p-1",
		name: "Maria Silva",
		lastAppointment: "2024-01-15T10:00:00Z",
		totalAppointments: 3,
		...overrides,
	};
}

describe("PatientsGrid", () => {
	it("mostra mensagem de lista vazia quando não há pacientes", () => {
		render(<PatientsGrid patients={[]} />);
		expect(screen.getByText("Nenhum paciente encontrado.")).toBeInTheDocument();
	});

	it("renderiza um card por paciente com nome e total de consultas", () => {
		const patients = [
			makePatient({ id: "p-1", name: "Maria Silva", totalAppointments: 3 }),
			makePatient({ id: "p-2", name: "João Souza", totalAppointments: 1 }),
		];
		render(<PatientsGrid patients={patients} />);
		expect(screen.getByText("Maria Silva")).toBeInTheDocument();
		expect(screen.getByText("João Souza")).toBeInTheDocument();
		expect(screen.getByText("3 consultas")).toBeInTheDocument();
		expect(screen.getByText("1 consulta")).toBeInTheDocument();
	});

	it("renderiza o link para o perfil do paciente", () => {
		const patients = [makePatient({ id: "p-42" })];
		render(<PatientsGrid patients={patients} />);
		const link = screen.getByText("Ver perfil").closest("a");
		expect(link).toHaveAttribute("href", "/dashboard/patients/p-42");
	});

	it("formata a data da última consulta", () => {
		const patients = [makePatient({ lastAppointment: "2024-03-20T10:00:00Z" })];
		render(<PatientsGrid patients={patients} />);
		expect(screen.getByText(/20\/03\/2024/)).toBeInTheDocument();
	});
});
