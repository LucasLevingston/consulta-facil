import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocationPicker } from "@/components/custom/map/LocationPicker";

vi.mock("next/dynamic", () => ({
	default: () => (props: Record<string, unknown>) => (
		<div
			data-testid="location-picker-inner-stub"
			data-props={JSON.stringify(props)}
		/>
	),
}));

describe("LocationPicker", () => {
	it("renderiza a instrução para clicar no mapa", () => {
		render(<LocationPicker lat={null} lng={null} onLocationSelect={vi.fn()} />);
		expect(
			screen.getByText("Clique no mapa para definir a localização da clínica"),
		).toBeInTheDocument();
	});

	it("não exibe coordenadas quando lat/lng são nulos", () => {
		render(<LocationPicker lat={null} lng={null} onLocationSelect={vi.fn()} />);
		expect(screen.queryByText(/Coordenadas:/)).not.toBeInTheDocument();
	});

	it("exibe as coordenadas formatadas quando lat/lng existem", () => {
		render(
			<LocationPicker lat={-15.8} lng={-47.9} onLocationSelect={vi.fn()} />,
		);
		expect(
			screen.getByText("Coordenadas: -15.800000, -47.900000"),
		).toBeInTheDocument();
	});

	it("repassa lat, lng e onLocationSelect para o componente interno do mapa", () => {
		const onLocationSelect = vi.fn();
		render(
			<LocationPicker
				lat={-15.8}
				lng={-47.9}
				onLocationSelect={onLocationSelect}
			/>,
		);
		const stub = screen.getByTestId("location-picker-inner-stub");
		const props = JSON.parse(stub.getAttribute("data-props") ?? "{}");
		expect(props.lat).toBe(-15.8);
		expect(props.lng).toBe(-47.9);
	});
});
