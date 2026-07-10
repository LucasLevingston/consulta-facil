import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ExamLabResponse } from "@/features/exams";

// Mock do next/image (padrão usado nos demais testes de card)
vi.mock("next/image", () => ({
	default: ({
		src,
		alt,
		...props
	}: {
		src: string;
		alt: string;
		[key: string]: unknown;
	}) => (
		// biome-ignore lint/performance/noImgElement: mock
		<img src={src} alt={alt} {...props} />
	),
}));

// Mock do SlotPickerDialog: o fluxo de agendamento é testado em slot-picker.test.tsx
vi.mock("@/components/laboratories/slot-picker-dialog", () => ({
	SlotPickerDialog: ({ open }: { open: boolean }) =>
		open ? <div data-testid="slot-picker-dialog">dialog aberto</div> : null,
}));

import { LabCard } from "./LabCard";
import { LabCardHours } from "./LabCardHours";
import { LabCardInfo } from "./LabCardInfo";

const baseLab: ExamLabResponse = {
	id: "lab-1",
	name: "Laboratório Central",
	description: "Exames de sangue e imagem.",
	phone: "(83) 99999-0000",
	address: "Rua das Análises, 50",
	city: "João Pessoa",
	state: "PB",
	zipCode: "58000-000",
	latitude: null,
	longitude: null,
	imageUrl: null,
	acceptedExams: ["Hemograma", "Glicemia"],
	status: "ACTIVE",
	hours: [
		{
			id: "h-1",
			dayOfWeek: "MONDAY",
			openTime: "08:00:00",
			closeTime: "18:00:00",
			slotDurationMinutes: 30,
			isOpen: true,
		},
		{
			id: "h-2",
			dayOfWeek: "SUNDAY",
			openTime: "00:00:00",
			closeTime: "00:00:00",
			slotDurationMinutes: 30,
			isOpen: false,
		},
	],
	createdAt: null,
};

describe("LabCard", () => {
	it("renderiza o nome do laboratório", () => {
		render(<LabCard lab={baseLab} examRequestId={null} />);
		expect(screen.getByText("Laboratório Central")).toBeInTheDocument();
	});

	it("renderiza a imagem quando imageUrl é fornecido", () => {
		render(
			<LabCard
				lab={{ ...baseLab, imageUrl: "https://img.example.com/lab.jpg" }}
				examRequestId={null}
			/>,
		);
		expect(screen.getByAltText("Laboratório Central")).toBeInTheDocument();
	});

	it("não renderiza imagem quando imageUrl é null", () => {
		render(<LabCard lab={baseLab} examRequestId={null} />);
		expect(
			screen.queryByAltText("Laboratório Central"),
		).not.toBeInTheDocument();
	});

	it("mostra o botão 'Ver horários' quando não há examRequestId", () => {
		render(<LabCard lab={baseLab} examRequestId={null} />);
		expect(screen.getByText("Ver horários")).toBeInTheDocument();
	});

	it("alterna a exibição dos horários ao clicar no botão", async () => {
		const user = userEvent.setup();
		render(<LabCard lab={baseLab} examRequestId={null} />);
		await user.click(screen.getByText("Ver horários"));
		expect(screen.getByText("Ocultar horários")).toBeInTheDocument();
	});

	it("mostra o botão 'Agendar aqui' quando há examRequestId", () => {
		render(<LabCard lab={baseLab} examRequestId="req-1" />);
		expect(screen.getByText("Agendar aqui")).toBeInTheDocument();
	});

	it("abre o SlotPickerDialog ao clicar em 'Agendar aqui'", async () => {
		const user = userEvent.setup();
		render(<LabCard lab={baseLab} examRequestId="req-1" />);
		expect(screen.queryByTestId("slot-picker-dialog")).not.toBeInTheDocument();
		await user.click(screen.getByText("Agendar aqui"));
		expect(screen.getByTestId("slot-picker-dialog")).toBeInTheDocument();
	});

	it("não renderiza a seção de horários quando o laboratório não possui horários", () => {
		render(<LabCard lab={{ ...baseLab, hours: [] }} examRequestId={null} />);
		expect(screen.queryByText(/por semana/)).not.toBeInTheDocument();
	});
});

describe("LabCardHours", () => {
	const sortedHours = baseLab.hours ?? [];

	it("mostra quantos dias o laboratório está aberto por semana", () => {
		render(
			<LabCardHours
				sortedHours={sortedHours}
				openDays={1}
				showHours={false}
				onToggle={vi.fn()}
			/>,
		);
		expect(screen.getByText("Aberto 1x por semana")).toBeInTheDocument();
	});

	it("mostra 'Ver horários' quando não há dias abertos", () => {
		render(
			<LabCardHours
				sortedHours={sortedHours}
				openDays={0}
				showHours={false}
				onToggle={vi.fn()}
			/>,
		);
		expect(screen.getByText("Ver horários")).toBeInTheDocument();
	});

	it("chama onToggle ao clicar no botão", async () => {
		const user = userEvent.setup();
		const onToggle = vi.fn();
		render(
			<LabCardHours
				sortedHours={sortedHours}
				openDays={1}
				showHours={false}
				onToggle={onToggle}
			/>,
		);
		await user.click(screen.getByRole("button"));
		expect(onToggle).toHaveBeenCalledTimes(1);
	});

	it("não exibe a lista de horários quando showHours é false", () => {
		render(
			<LabCardHours
				sortedHours={sortedHours}
				openDays={1}
				showHours={false}
				onToggle={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Fechado")).not.toBeInTheDocument();
	});

	it("exibe os horários formatados quando showHours é true", () => {
		render(
			<LabCardHours
				sortedHours={sortedHours}
				openDays={1}
				showHours={true}
				onToggle={vi.fn()}
			/>,
		);
		expect(screen.getByText("08:00 – 18:00")).toBeInTheDocument();
		expect(screen.getByText("Fechado")).toBeInTheDocument();
	});

	it("marca aria-expanded conforme showHours", () => {
		render(
			<LabCardHours
				sortedHours={sortedHours}
				openDays={1}
				showHours={true}
				onToggle={vi.fn()}
			/>,
		);
		expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
	});
});

describe("LabCardInfo", () => {
	it("renderiza nome e descrição do laboratório", () => {
		render(<LabCardInfo lab={baseLab} />);
		expect(screen.getByText("Laboratório Central")).toBeInTheDocument();
		expect(screen.getByText("Exames de sangue e imagem.")).toBeInTheDocument();
	});

	it("renderiza endereço, cidade e estado", () => {
		render(<LabCardInfo lab={baseLab} />);
		expect(
			screen.getByText("Rua das Análises, 50, João Pessoa, PB"),
		).toBeInTheDocument();
	});

	it("renderiza o telefone", () => {
		render(<LabCardInfo lab={baseLab} />);
		expect(screen.getByText("(83) 99999-0000")).toBeInTheDocument();
	});

	it("renderiza até 4 exames aceitos como badges", () => {
		render(<LabCardInfo lab={baseLab} />);
		expect(screen.getByText("Hemograma")).toBeInTheDocument();
		expect(screen.getByText("Glicemia")).toBeInTheDocument();
	});

	it("mostra badge de '+N mais' quando há mais de 4 exames aceitos", () => {
		render(
			<LabCardInfo
				lab={{
					...baseLab,
					acceptedExams: [
						"Hemograma",
						"Glicemia",
						"Colesterol",
						"TSH",
						"Ureia",
						"Creatinina",
					],
				}}
			/>,
		);
		expect(screen.getByText("+2 mais")).toBeInTheDocument();
	});

	it("não renderiza descrição quando ausente", () => {
		render(<LabCardInfo lab={{ ...baseLab, description: null }} />);
		expect(
			screen.queryByText("Exames de sangue e imagem."),
		).not.toBeInTheDocument();
	});

	it("não renderiza telefone quando ausente", () => {
		render(<LabCardInfo lab={{ ...baseLab, phone: null }} />);
		expect(screen.queryByText("(83) 99999-0000")).not.toBeInTheDocument();
	});
});
