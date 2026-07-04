import { render, screen } from "@testing-library/react";
import { User } from "lucide-react";
import { describe, expect, it } from "vitest";

import { PatientDetailInfoRow } from "@/components/patients/detail/PatientDetailInfoRow";
import { PatientInfoCard } from "@/components/patients/detail/PatientInfoCard";
import { PatientProfileCard } from "@/components/patients/detail/PatientProfileCard";
import { PatientScoreCard } from "@/components/patients/detail/PatientScoreCard";
import { PatientScoreStatItem } from "@/components/patients/detail/PatientScoreStatItem";
import type { AppointmentResponse } from "@/features/appointments";
import type { PatientProfile } from "@/features/patients";

function makeAppointment(
	overrides: Partial<AppointmentResponse> = {},
): AppointmentResponse {
	return {
		id: "a-1",
		patientId: "p-1",
		professionalId: "prof-1",
		scheduledAt: "2024-01-15T10:00:00Z",
		status: "COMPLETED",
		...overrides,
	} as AppointmentResponse;
}

describe("PatientDetailInfoRow", () => {
	it("não renderiza nada quando value é vazio", () => {
		const { container } = render(
			<PatientDetailInfoRow icon={User} label="E-mail" value={null} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza label e valor quando value é preenchido", () => {
		render(
			<PatientDetailInfoRow
				icon={User}
				label="E-mail"
				value="paciente@example.com"
			/>,
		);
		expect(screen.getByText("E-mail")).toBeInTheDocument();
		expect(screen.getByText("paciente@example.com")).toBeInTheDocument();
	});
});

describe("PatientInfoCard", () => {
	const basePatient: PatientProfile = {
		id: "p-1",
		name: "Maria Silva",
		email: "maria@example.com",
		phone: "11999999999",
		cpf: "12345678900",
		birthDate: "1990-05-10T00:00:00",
		gender: "FEMALE",
		occupation: "Professora",
	};

	it("renderiza todas as informações pessoais preenchidas", () => {
		render(<PatientInfoCard patient={basePatient} />);
		expect(screen.getByText("Informações pessoais")).toBeInTheDocument();
		expect(screen.getByText("maria@example.com")).toBeInTheDocument();
		expect(screen.getByText("11999999999")).toBeInTheDocument();
		expect(screen.getByText("12345678900")).toBeInTheDocument();
		expect(screen.getByText("10/05/1990")).toBeInTheDocument();
		expect(screen.getByText("Feminino")).toBeInTheDocument();
		expect(screen.getByText("Professora")).toBeInTheDocument();
	});

	it("não renderiza campos ausentes do paciente", () => {
		const patient: PatientProfile = {
			id: "p-2",
			name: "João",
			email: "joao@example.com",
		};
		render(<PatientInfoCard patient={patient} />);
		expect(screen.getByText("joao@example.com")).toBeInTheDocument();
		expect(screen.queryByText("Telefone")).not.toBeInTheDocument();
		expect(screen.queryByText("CPF")).not.toBeInTheDocument();
		expect(screen.queryByText("Data de nascimento")).not.toBeInTheDocument();
		expect(screen.queryByText("Ocupação")).not.toBeInTheDocument();
	});

	it("traduz gênero MALE para Masculino", () => {
		render(<PatientInfoCard patient={{ ...basePatient, gender: "MALE" }} />);
		expect(screen.getByText("Masculino")).toBeInTheDocument();
	});

	it("traduz gênero OTHER para Outro", () => {
		render(<PatientInfoCard patient={{ ...basePatient, gender: "OTHER" }} />);
		expect(screen.getByText("Outro")).toBeInTheDocument();
	});
});

describe("PatientProfileCard", () => {
	const patient: PatientProfile = {
		id: "p-1",
		name: "Maria Silva",
		occupation: "Professora",
	};

	it("renderiza nome, ocupação e iniciais do paciente", () => {
		render(
			<PatientProfileCard
				patient={patient}
				initials="MS"
				appointmentsCount={3}
			/>,
		);
		expect(screen.getByText("Maria Silva")).toBeInTheDocument();
		expect(screen.getByText("Professora")).toBeInTheDocument();
		expect(screen.getByText("MS")).toBeInTheDocument();
		expect(screen.getByText("3 consultas")).toBeInTheDocument();
	});

	it("usa singular 'consulta' quando appointmentsCount é 1", () => {
		render(
			<PatientProfileCard
				patient={patient}
				initials="MS"
				appointmentsCount={1}
			/>,
		);
		expect(screen.getByText("1 consulta")).toBeInTheDocument();
	});

	it("não renderiza ocupação quando ausente", () => {
		render(
			<PatientProfileCard
				patient={{ id: "p-2", name: "João" }}
				initials="JO"
				appointmentsCount={0}
			/>,
		);
		expect(screen.getByText("João")).toBeInTheDocument();
		expect(screen.queryByText("Professora")).not.toBeInTheDocument();
	});
});

describe("PatientScoreCard", () => {
	it("não renderiza nada quando não há consultas", () => {
		const { container } = render(<PatientScoreCard appointments={[]} />);
		expect(container.firstChild).toBeNull();
	});

	it("calcula e renderiza score, comparecimento, pagamentos e cancelamentos", () => {
		const appointments = [
			makeAppointment({
				id: "a-1",
				status: "COMPLETED",
				paymentStatus: "PAID",
			}),
			makeAppointment({
				id: "a-2",
				status: "COMPLETED",
				paymentStatus: "PAID",
			}),
			makeAppointment({ id: "a-3", status: "CANCELED", paymentStatus: null }),
		];
		render(<PatientScoreCard appointments={appointments} />);
		expect(screen.getByText("Score do paciente")).toBeInTheDocument();
		expect(screen.getByText("80")).toBeInTheDocument();
		expect(screen.getByText("Comparecimento")).toBeInTheDocument();
		expect(screen.getByText("67%")).toBeInTheDocument();
		expect(screen.getByText("2/3 consultas")).toBeInTheDocument();
		expect(screen.getByText("Pagamentos")).toBeInTheDocument();
		expect(screen.getByText("100%")).toBeInTheDocument();
		expect(screen.getByText("2/2 pagos")).toBeInTheDocument();
		expect(screen.getByText("Cancelamentos")).toBeInTheDocument();
		expect(screen.getByText("de 3 consultas")).toBeInTheDocument();
	});
});

describe("PatientScoreStatItem", () => {
	it("renderiza label, valor, subtítulo e ícone", () => {
		render(
			<PatientScoreStatItem
				iconBg="bg-green-500/10"
				icon={<span data-testid="icon">icon</span>}
				label="Comparecimento"
				value="80%"
				subtitle="4/5 consultas"
			/>,
		);
		expect(screen.getByText("Comparecimento")).toBeInTheDocument();
		expect(screen.getByText("80%")).toBeInTheDocument();
		expect(screen.getByText("4/5 consultas")).toBeInTheDocument();
		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});
});
