import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CopyReferralButton } from "@/components/referral/CopyReferralButton";

describe("CopyReferralButton", () => {
	beforeEach(() => {
		vi.useRealTimers();
		Object.assign(navigator, {
			clipboard: {
				writeText: vi.fn().mockResolvedValue(undefined),
			},
		});
	});

	it("renderiza o botao com o texto padrao 'Copiar'", () => {
		render(<CopyReferralButton code="ABC123" />);
		expect(screen.getByText("Copiar")).toBeInTheDocument();
	});

	it("chama navigator.clipboard.writeText com o codigo ao clicar", async () => {
		render(<CopyReferralButton code="ABC123" />);
		fireEvent.click(screen.getByRole("button"));

		await waitFor(() =>
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith("ABC123"),
		);
	});

	it("exibe feedback visual 'Copiado!' apos o clique", async () => {
		render(<CopyReferralButton code="XYZ789" />);
		fireEvent.click(screen.getByRole("button"));

		await waitFor(() =>
			expect(screen.getByText("Copiado!")).toBeInTheDocument(),
		);
	});

	it("volta a exibir 'Copiar' apos o tempo de feedback expirar", async () => {
		vi.useFakeTimers();
		render(<CopyReferralButton code="ABC123" />);

		fireEvent.click(screen.getByRole("button"));

		await vi.waitFor(() =>
			expect(screen.getByText("Copiado!")).toBeInTheDocument(),
		);

		vi.advanceTimersByTime(2000);

		await vi.waitFor(() =>
			expect(screen.getByText("Copiar")).toBeInTheDocument(),
		);
		vi.useRealTimers();
	});
});
