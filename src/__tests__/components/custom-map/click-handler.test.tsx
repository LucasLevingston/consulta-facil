import { render } from "@testing-library/react";
import { useMapEvents } from "react-leaflet";
import { describe, expect, it, vi } from "vitest";
import { ClickHandler } from "@/components/custom/map/ClickHandler";

vi.mock("react-leaflet", () => ({
	useMapEvents: vi.fn(),
}));

describe("ClickHandler", () => {
	it("registra o handler de clique via useMapEvents", () => {
		render(<ClickHandler onLocationSelect={vi.fn()} />);
		expect(useMapEvents).toHaveBeenCalledTimes(1);
		expect(useMapEvents).toHaveBeenCalledWith(
			expect.objectContaining({ click: expect.any(Function) }),
		);
	});

	it("chama onLocationSelect com lat/lng do evento de clique", () => {
		const onLocationSelect = vi.fn();
		render(<ClickHandler onLocationSelect={onLocationSelect} />);

		const calls = vi.mocked(useMapEvents).mock.calls;
		const handlers = calls[calls.length - 1][0];
		handlers.click({ latlng: { lat: -15.8, lng: -47.9 } } as never);

		expect(onLocationSelect).toHaveBeenCalledWith(-15.8, -47.9);
	});

	it("não renderiza nenhum elemento visível", () => {
		const { container } = render(<ClickHandler onLocationSelect={vi.fn()} />);
		expect(container).toBeEmptyDOMElement();
	});
});
