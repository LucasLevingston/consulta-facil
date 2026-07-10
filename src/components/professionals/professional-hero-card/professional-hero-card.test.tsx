import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProfessionalHeroCard } from "./ProfessionalHeroCard";

describe("ProfessionalHeroCard", () => {
	const professional = {
		name: "Dra. Ana Silva",
		specialty: "Cardiologia",
		imageUrl: null,
		rating: 4.5,
		consultationCount: 10,
	} as never;

	it("renderiza o nome do profissional", () => {
		render(
			<ProfessionalHeroCard
				professional={professional}
				initials="AS"
				messaging={{ available: true, pending: false, onSend: vi.fn() }}
				onSchedule={vi.fn()}
			/>,
		);
		expect(screen.getByText("Dra. Ana Silva")).toBeInTheDocument();
	});

	it("renderiza o botão de mensagem quando messaging.available=true", () => {
		render(
			<ProfessionalHeroCard
				professional={professional}
				initials="AS"
				messaging={{ available: true, pending: false, onSend: vi.fn() }}
				onSchedule={vi.fn()}
			/>,
		);
		expect(screen.getByText("Enviar mensagem")).toBeInTheDocument();
	});

	it("não renderiza o botão de mensagem quando messaging.available=false", () => {
		render(
			<ProfessionalHeroCard
				professional={professional}
				initials="AS"
				messaging={{ available: false, pending: false, onSend: vi.fn() }}
				onSchedule={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Enviar mensagem")).not.toBeInTheDocument();
	});

	it("chama onSchedule ao clicar em 'Agendar consulta'", async () => {
		const onSchedule = vi.fn();
		render(
			<ProfessionalHeroCard
				professional={professional}
				initials="AS"
				messaging={{ available: true, pending: false, onSend: vi.fn() }}
				onSchedule={onSchedule}
			/>,
		);
		await userEvent.click(screen.getByText("Agendar consulta"));
		expect(onSchedule).toHaveBeenCalledTimes(1);
	});

	it("chama onSend ao clicar em 'Enviar mensagem'", async () => {
		const onSend = vi.fn();
		render(
			<ProfessionalHeroCard
				professional={professional}
				initials="AS"
				messaging={{ available: true, pending: false, onSend }}
				onSchedule={vi.fn()}
			/>,
		);
		await userEvent.click(screen.getByText("Enviar mensagem"));
		expect(onSend).toHaveBeenCalledTimes(1);
	});
});
