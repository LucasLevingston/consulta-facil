import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Mocks do SDK de vídeo (Daily.co) — não simulamos WebRTC real, só os hooks/contexto usados
const mockUseDaily = vi.hoisted(() => vi.fn());
const mockUseLocalSessionId = vi.hoisted(() => vi.fn());
const mockUseParticipantIds = vi.hoisted(() => vi.fn());

vi.mock("@daily-co/daily-react", () => ({
	DailyProvider: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="daily-provider">{children}</div>
	),
	useDaily: mockUseDaily,
	useLocalSessionId: mockUseLocalSessionId,
	useParticipantIds: mockUseParticipantIds,
}));

import { VideoControls } from "@/components/custom/VideoControls";
import { VideoRoom } from "@/components/custom/VideoRoom";
import { VideoRoomInner } from "@/components/custom/VideoRoomInner";
import { VideoTiles } from "@/components/custom/VideoTiles";

describe("VideoTiles", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseLocalSessionId.mockReturnValue("local-1");
	});

	it("mostra a mensagem de espera quando não há participantes remotos", () => {
		mockUseParticipantIds.mockReturnValue([]);
		render(<VideoTiles />);
		expect(
			screen.getByText("Aguardando o outro participante entrar..."),
		).toBeInTheDocument();
	});

	it("renderiza o rótulo 'Você' para o participante local", () => {
		mockUseParticipantIds.mockReturnValue([]);
		render(<VideoTiles />);
		expect(screen.getByText("Você")).toBeInTheDocument();
	});

	it("não mostra a mensagem de espera e renderiza tiles para participantes remotos", () => {
		mockUseParticipantIds.mockReturnValue(["remote-1"]);
		const { container } = render(<VideoTiles />);
		expect(
			screen.queryByText("Aguardando o outro participante entrar..."),
		).not.toBeInTheDocument();
		expect(container.querySelectorAll("video")).toHaveLength(2);
	});
});

describe("VideoControls", () => {
	const setLocalAudio = vi.fn();
	const setLocalVideo = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		mockUseDaily.mockReturnValue({ setLocalAudio, setLocalVideo });
	});

	it("renderiza os botões de mic, câmera e encerrar chamada", () => {
		render(<VideoControls onEnd={vi.fn()} />);
		expect(screen.getByText("Silenciar")).toBeInTheDocument();
		expect(screen.getByText("Desligar câmera")).toBeInTheDocument();
		expect(screen.getByText("Encerrar consulta")).toBeInTheDocument();
	});

	it("alterna o texto do botão de mic e chama setLocalAudio ao clicar", async () => {
		render(<VideoControls onEnd={vi.fn()} />);
		await userEvent.click(screen.getByText("Silenciar"));
		expect(setLocalAudio).toHaveBeenCalledTimes(1);
		expect(screen.getByText("Ativar mic")).toBeInTheDocument();
	});

	it("alterna o texto do botão de câmera e chama setLocalVideo ao clicar", async () => {
		render(<VideoControls onEnd={vi.fn()} />);
		await userEvent.click(screen.getByText("Desligar câmera"));
		expect(setLocalVideo).toHaveBeenCalledTimes(1);
		expect(screen.getByText("Ligar câmera")).toBeInTheDocument();
	});

	it("chama onEnd ao clicar em encerrar consulta", async () => {
		const onEnd = vi.fn();
		render(<VideoControls onEnd={onEnd} />);
		await userEvent.click(screen.getByText("Encerrar consulta"));
		expect(onEnd).toHaveBeenCalledTimes(1);
	});
});

describe("VideoRoomInner", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseLocalSessionId.mockReturnValue("local-1");
		mockUseParticipantIds.mockReturnValue([]);
	});

	it("renderiza os tiles e os controles de vídeo", () => {
		mockUseDaily.mockReturnValue({ leave: vi.fn() });
		render(<VideoRoomInner onEnd={vi.fn()} />);
		expect(screen.getByText("Encerrar consulta")).toBeInTheDocument();
		expect(
			screen.getByText("Aguardando o outro participante entrar..."),
		).toBeInTheDocument();
	});

	it("chama daily.leave() ao desmontar o componente", () => {
		const leave = vi.fn();
		mockUseDaily.mockReturnValue({ leave });
		const { unmount } = render(<VideoRoomInner onEnd={vi.fn()} />);
		unmount();
		expect(leave).toHaveBeenCalledTimes(1);
	});
});

describe("VideoRoom", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseDaily.mockReturnValue({ leave: vi.fn() });
		mockUseLocalSessionId.mockReturnValue("local-1");
		mockUseParticipantIds.mockReturnValue([]);
	});

	it("envolve a sala com o DailyProvider usando a url e o token informados", () => {
		render(
			<VideoRoom
				room={{ roomUrl: "https://daily.co/sala-1", token: "tok-123" } as never}
				onEnd={vi.fn()}
			/>,
		);
		expect(screen.getByTestId("daily-provider")).toBeInTheDocument();
		expect(screen.getByText("Encerrar consulta")).toBeInTheDocument();
	});

	it("chama onEnd ao encerrar a chamada a partir dos controles", async () => {
		const onEnd = vi.fn();
		render(
			<VideoRoom
				room={{ roomUrl: "https://daily.co/sala-1", token: "tok-123" } as never}
				onEnd={onEnd}
			/>,
		);
		await userEvent.click(screen.getByText("Encerrar consulta"));
		expect(onEnd).toHaveBeenCalledTimes(1);
	});
});
