import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/components/appointments/detail/use-generate-meet-link", () => ({
	useGenerateMeetLink: vi.fn(),
}));
vi.mock("@/components/appointments/detail/use-create-room", () => ({
	useCreateRoom: vi.fn(),
}));

import { toast } from "sonner";
import { useCreateRoom } from "@/components/appointments/detail/use-create-room";
import { useGenerateMeetLink } from "@/components/appointments/detail/use-generate-meet-link";
import { useAppointmentScheduleCard } from "@/components/appointments/detail/useAppointmentScheduleCard";

describe("useAppointmentScheduleCard", () => {
	function setup(opts?: {
		generateMeetLink?: ReturnType<typeof vi.fn>;
		createRoom?: ReturnType<typeof vi.fn>;
	}) {
		const generateMeetLink =
			opts?.generateMeetLink ?? vi.fn().mockResolvedValue(undefined);
		const createRoom = opts?.createRoom ?? vi.fn().mockResolvedValue(undefined);
		vi.mocked(useGenerateMeetLink).mockReturnValue({
			mutateAsync: generateMeetLink,
			isPending: false,
		} as never);
		vi.mocked(useCreateRoom).mockReturnValue({
			mutateAsync: createRoom,
			isPending: false,
		} as never);
		return { generateMeetLink, createRoom };
	}

	it("inicia com qrOpen e rescheduleOpen fechados", () => {
		setup();
		const onVideoStart = vi.fn();
		const { result } = renderHook(() =>
			useAppointmentScheduleCard("a-1", onVideoStart),
		);
		expect(result.current.qrOpen).toBe(false);
		expect(result.current.rescheduleOpen).toBe(false);
	});

	it("abre o qrOpen ao chamar setQrOpen(true)", () => {
		setup();
		const { result } = renderHook(() =>
			useAppointmentScheduleCard("a-1", vi.fn()),
		);
		act(() => result.current.setQrOpen(true));
		expect(result.current.qrOpen).toBe(true);
	});

	it("abre o rescheduleOpen ao chamar setRescheduleOpen(true)", () => {
		setup();
		const { result } = renderHook(() =>
			useAppointmentScheduleCard("a-1", vi.fn()),
		);
		act(() => result.current.setRescheduleOpen(true));
		expect(result.current.rescheduleOpen).toBe(true);
	});

	it("chama generateMeetLink com o appointmentId ao chamar onGenerateMeetLink", async () => {
		const { generateMeetLink } = setup();
		const { result } = renderHook(() =>
			useAppointmentScheduleCard("a-1", vi.fn()),
		);
		await act(async () => {
			await result.current.onGenerateMeetLink();
		});
		expect(generateMeetLink).toHaveBeenCalledWith("a-1");
	});

	it("cria a sala e chama onVideoStart em caso de sucesso", async () => {
		const { createRoom } = setup();
		const onVideoStart = vi.fn();
		const { result } = renderHook(() =>
			useAppointmentScheduleCard("a-1", onVideoStart),
		);
		await act(async () => {
			await result.current.handleStartVideoRoom();
		});
		expect(createRoom).toHaveBeenCalledWith("a-1");
		expect(onVideoStart).toHaveBeenCalledWith("a-1");
	});

	it("mostra erro e não chama onVideoStart quando createRoom falha", async () => {
		const createRoom = vi.fn().mockRejectedValue(new Error("erro"));
		setup({ createRoom });
		const onVideoStart = vi.fn();
		const { result } = renderHook(() =>
			useAppointmentScheduleCard("a-1", onVideoStart),
		);
		await act(async () => {
			await result.current.handleStartVideoRoom();
		});
		expect(toast.error).toHaveBeenCalledWith("Erro ao iniciar teleconsulta.");
		expect(onVideoStart).not.toHaveBeenCalled();
	});
});
