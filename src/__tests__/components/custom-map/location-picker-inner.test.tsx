import { render, screen } from "@testing-library/react";
import { useMapEvents } from "react-leaflet";
import { describe, expect, it, vi } from "vitest";
import LocationPickerInner from "@/components/custom/map/LocationPickerInner";

vi.mock("react-leaflet", () => ({
	MapContainer: ({
		children,
		center,
		zoom,
	}: {
		children: React.ReactNode;
		center: [number, number];
		zoom: number;
	}) => (
		<div
			data-testid="map-container"
			data-center={JSON.stringify(center)}
			data-zoom={zoom}
		>
			{children}
		</div>
	),
	TileLayer: () => <div data-testid="tile-layer" />,
	Marker: ({ position }: { position: [number, number] }) => (
		<div data-testid="marker" data-position={JSON.stringify(position)} />
	),
	useMapEvents: vi.fn(),
}));

describe("LocationPickerInner", () => {
	it("renderiza o mapa e a camada de tiles", () => {
		render(
			<LocationPickerInner lat={null} lng={null} onLocationSelect={vi.fn()} />,
		);
		expect(screen.getByTestId("map-container")).toBeInTheDocument();
		expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
	});

	it("não renderiza marcador quando lat/lng são nulos", () => {
		render(
			<LocationPickerInner lat={null} lng={null} onLocationSelect={vi.fn()} />,
		);
		expect(screen.queryByTestId("marker")).not.toBeInTheDocument();
	});

	it("renderiza marcador na posição informada quando lat/lng existem", () => {
		render(
			<LocationPickerInner
				lat={-15.8}
				lng={-47.9}
				onLocationSelect={vi.fn()}
			/>,
		);
		expect(screen.getByTestId("marker")).toHaveAttribute(
			"data-position",
			JSON.stringify([-15.8, -47.9]),
		);
	});

	it("usa zoom 13 e centro nas coordenadas quando lat/lng existem", () => {
		render(
			<LocationPickerInner
				lat={-15.8}
				lng={-47.9}
				onLocationSelect={vi.fn()}
			/>,
		);
		const map = screen.getByTestId("map-container");
		expect(map).toHaveAttribute("data-zoom", "13");
		expect(map).toHaveAttribute("data-center", JSON.stringify([-15.8, -47.9]));
	});

	it("usa zoom 4 e centro padrão quando lat é nulo", () => {
		render(
			<LocationPickerInner lat={null} lng={null} onLocationSelect={vi.fn()} />,
		);
		const map = screen.getByTestId("map-container");
		expect(map).toHaveAttribute("data-zoom", "4");
		expect(map).toHaveAttribute("data-center", JSON.stringify([-15.8, -47.9]));
	});

	it("propaga o clique no mapa via ClickHandler chamando onLocationSelect", () => {
		const onLocationSelect = vi.fn();
		render(
			<LocationPickerInner
				lat={null}
				lng={null}
				onLocationSelect={onLocationSelect}
			/>,
		);
		const calls = vi.mocked(useMapEvents).mock.calls;
		const handlers = calls[calls.length - 1][0];
		handlers.click({ latlng: { lat: -10, lng: -50 } } as never);
		expect(onLocationSelect).toHaveBeenCalledWith(-10, -50);
	});
});
