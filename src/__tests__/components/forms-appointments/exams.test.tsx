import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/exams", () => ({
	useExamRequestsByAppointment: vi.fn(),
}));
vi.mock("@/features/services", () => ({
	useGetProfessionalServices: vi.fn(),
}));

// ExamUploadButton, ExamReviewForm e RequestExamForm têm testes próprios em
// exam-actions.test.tsx; aqui são mockados para isolar os componentes de composição/exibição.
vi.mock("@/components/forms/Appointments/ExamUploadButton", () => ({
	ExamUploadButton: ({ examId }: { examId: string }) => (
		<div data-testid="exam-upload-button">upload-{examId}</div>
	),
}));
vi.mock("@/components/forms/Appointments/ExamReviewForm", () => ({
	ExamReviewForm: ({ examId }: { examId: string }) => (
		<div data-testid="exam-review-form">review-{examId}</div>
	),
}));
vi.mock("@/components/forms/Appointments/RequestExamForm", () => ({
	RequestExamForm: () => (
		<div data-testid="request-exam-form">request-exam-form</div>
	),
}));

import { ConsultationOnlyServicesSection } from "@/components/forms/Appointments/ConsultationOnlyServicesSection";
import { ExamCard } from "@/components/forms/Appointments/ExamCard";
import { ExamsSection } from "@/components/forms/Appointments/ExamsSection";
import { ExamsSectionContent } from "@/components/forms/Appointments/ExamsSectionContent";
import { ServiceSelector } from "@/components/forms/Appointments/ServiceSelector";
import { useExamRequestsByAppointment } from "@/features/exams";
import { useGetProfessionalServices } from "@/features/services";

const mockUseExamRequestsByAppointment = vi.mocked(
	useExamRequestsByAppointment,
);
const mockUseGetProfessionalServices = vi.mocked(useGetProfessionalServices);

const baseExam = {
	id: "exam-1",
	appointmentId: "appt-1",
	professionalId: "prof-1",
	patientId: "patient-1",
	examName: "HEMOGRAMA_COMPLETO",
	status: "PENDING",
	instructions: null,
	fileUrl: null,
	fileName: null,
	professionalNotes: null,
} as never;

describe("ConsultationOnlyServicesSection", () => {
	const services = [
		{
			id: "svc-1",
			name: "Exame de sangue",
			description: "Coleta em jejum",
			price: 150,
			durationMinutes: 30,
			requiresConsultation: true,
		},
	] as never;

	it("não renderiza nada quando não há serviços", () => {
		const { container } = render(
			<ConsultationOnlyServicesSection services={[]} />,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it("renderiza o nome e o aviso de consulta prévia para cada serviço", () => {
		render(<ConsultationOnlyServicesSection services={services} />);

		expect(screen.getByText("Exame de sangue")).toBeInTheDocument();
		expect(screen.getByText("requer consulta prévia")).toBeInTheDocument();
	});

	it("renderiza a descrição do serviço quando presente", () => {
		render(<ConsultationOnlyServicesSection services={services} />);

		expect(screen.getByText("Coleta em jejum")).toBeInTheDocument();
	});
});

describe("ExamCard", () => {
	it("renderiza o nome traduzido do exame", () => {
		render(
			<ExamCard exam={baseExam} isPatient={false} isProfessional={false} />,
		);

		expect(screen.getByText("Hemograma Completo")).toBeInTheDocument();
	});

	it("renderiza as instruções quando presentes", () => {
		render(
			<ExamCard
				exam={{ ...baseExam, instructions: "Em jejum por 8h" }}
				isPatient={false}
				isProfessional={false}
			/>,
		);

		expect(screen.getByText("Em jejum por 8h")).toBeInTheDocument();
	});

	it("renderiza o link do arquivo quando fileUrl está presente", () => {
		render(
			<ExamCard
				exam={{
					...baseExam,
					fileUrl: "https://arquivo.com/x.pdf",
					fileName: "resultado.pdf",
				}}
				isPatient={false}
				isProfessional={false}
			/>,
		);

		const link = screen.getByRole("link", { name: /resultado.pdf/ });
		expect(link).toHaveAttribute("href", "https://arquivo.com/x.pdf");
	});

	it("renderiza as observações do profissional quando presentes", () => {
		render(
			<ExamCard
				exam={{
					...baseExam,
					professionalNotes: "Resultado dentro da normalidade",
				}}
				isPatient={false}
				isProfessional={false}
			/>,
		);

		expect(
			screen.getByText("Resultado dentro da normalidade"),
		).toBeInTheDocument();
	});

	it("mostra o botão de upload para o paciente quando o exame está pendente", () => {
		render(
			<ExamCard exam={baseExam} isPatient={true} isProfessional={false} />,
		);

		expect(screen.getByTestId("exam-upload-button")).toBeInTheDocument();
	});

	it("não mostra o botão de upload quando o exame não está pendente", () => {
		render(
			<ExamCard
				exam={{ ...baseExam, status: "UPLOADED" }}
				isPatient={true}
				isProfessional={false}
			/>,
		);

		expect(screen.queryByTestId("exam-upload-button")).not.toBeInTheDocument();
	});

	it("mostra o formulário de revisão para o profissional quando o exame foi enviado", () => {
		render(
			<ExamCard
				exam={{ ...baseExam, status: "UPLOADED" }}
				isPatient={false}
				isProfessional={true}
			/>,
		);

		expect(screen.getByTestId("exam-review-form")).toBeInTheDocument();
	});
});

describe("ExamsSectionContent", () => {
	it("mostra mensagem de lista vazia para o paciente", () => {
		mockUseExamRequestsByAppointment.mockReturnValue({ data: [] } as never);

		render(
			<ExamsSectionContent
				appointmentId="appt-1"
				isPatient={true}
				isProfessional={false}
			/>,
		);

		expect(screen.getByText("Nenhum exame solicitado.")).toBeInTheDocument();
	});

	it("mostra mensagem de lista vazia com dica para o profissional", () => {
		mockUseExamRequestsByAppointment.mockReturnValue({ data: [] } as never);

		render(
			<ExamsSectionContent
				appointmentId="appt-1"
				isPatient={false}
				isProfessional={true}
			/>,
		);

		expect(
			screen.getByText(/Nenhum exame solicitado\. Clique em/),
		).toBeInTheDocument();
	});

	it("renderiza o RequestExamForm apenas para o profissional", () => {
		mockUseExamRequestsByAppointment.mockReturnValue({ data: [] } as never);

		render(
			<ExamsSectionContent
				appointmentId="appt-1"
				isPatient={false}
				isProfessional={true}
			/>,
		);

		expect(screen.getByTestId("request-exam-form")).toBeInTheDocument();
	});

	it("renderiza um ExamCard para cada exame retornado", () => {
		mockUseExamRequestsByAppointment.mockReturnValue({
			data: [baseExam, { ...baseExam, id: "exam-2" }],
		} as never);

		render(
			<ExamsSectionContent
				appointmentId="appt-1"
				isPatient={true}
				isProfessional={false}
			/>,
		);

		expect(screen.getAllByText("Hemograma Completo")).toHaveLength(2);
	});
});

describe("ExamsSection", () => {
	it("renderiza o conteúdo da seção de exames dentro do SuspenseBoundary", () => {
		mockUseExamRequestsByAppointment.mockReturnValue({ data: [] } as never);

		render(
			<ExamsSection
				appointmentId="appt-1"
				isPatient={true}
				isProfessional={false}
			/>,
		);

		expect(screen.getByText("Exames")).toBeInTheDocument();
	});
});

describe("ServiceSelector", () => {
	it("mostra o texto de carregamento enquanto os serviços carregam", () => {
		mockUseGetProfessionalServices.mockReturnValue({
			data: undefined,
			isLoading: true,
		} as never);

		render(
			<ServiceSelector
				professionalId="prof-1"
				consultationPrice={100}
				value={null}
				onChange={vi.fn()}
			/>,
		);

		expect(screen.getByText("Carregando serviços...")).toBeInTheDocument();
	});

	it("renderiza a opção de consulta com o preço formatado", () => {
		mockUseGetProfessionalServices.mockReturnValue({
			data: [],
			isLoading: false,
		} as never);

		render(
			<ServiceSelector
				professionalId="prof-1"
				consultationPrice={150}
				value={null}
				onChange={vi.fn()}
			/>,
		);

		expect(screen.getByText("Consulta")).toBeInTheDocument();
		expect(screen.getByText(/R\$\s*150,00/)).toBeInTheDocument();
	});

	it("renderiza apenas os serviços ativos que não exigem consulta prévia como opções diretas", () => {
		mockUseGetProfessionalServices.mockReturnValue({
			data: [
				{
					id: "svc-1",
					name: "Limpeza de pele",
					price: 80,
					durationMinutes: 40,
					requiresConsultation: false,
					active: true,
				},
				{
					id: "svc-2",
					name: "Procedimento avançado",
					price: 300,
					durationMinutes: 60,
					requiresConsultation: true,
					active: true,
				},
				{
					id: "svc-3",
					name: "Serviço inativo",
					price: 50,
					durationMinutes: 20,
					requiresConsultation: false,
					active: false,
				},
			],
			isLoading: false,
		} as never);

		render(
			<ServiceSelector
				professionalId="prof-1"
				consultationPrice={100}
				value={null}
				onChange={vi.fn()}
			/>,
		);

		expect(screen.getByText("Limpeza de pele")).toBeInTheDocument();
		expect(screen.queryByText("Serviço inativo")).not.toBeInTheDocument();
		// serviço que exige consulta prévia aparece na seção de "somente após consulta"
		expect(screen.getByText("Procedimento avançado")).toBeInTheDocument();
		expect(screen.getByText("requer consulta prévia")).toBeInTheDocument();
	});

	it("chama onChange com o id do serviço clicado", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		mockUseGetProfessionalServices.mockReturnValue({
			data: [
				{
					id: "svc-1",
					name: "Limpeza de pele",
					price: 80,
					durationMinutes: 40,
					requiresConsultation: false,
					active: true,
				},
			],
			isLoading: false,
		} as never);

		render(
			<ServiceSelector
				professionalId="prof-1"
				consultationPrice={100}
				value={null}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByText("Limpeza de pele"));

		expect(onChange).toHaveBeenCalledWith("svc-1");
	});

	it("chama onChange com null ao clicar na opção de consulta", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		mockUseGetProfessionalServices.mockReturnValue({
			data: [],
			isLoading: false,
		} as never);

		render(
			<ServiceSelector
				professionalId="prof-1"
				consultationPrice={100}
				value="svc-1"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByText("Consulta"));

		expect(onChange).toHaveBeenCalledWith(null);
	});
});
