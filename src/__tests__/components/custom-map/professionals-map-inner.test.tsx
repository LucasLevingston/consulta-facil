import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfessionalsMapInner from "@/components/custom/map/ProfessionalsMapInner";
import type { ProfessionalResponse } from "@/features/professionals";

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
	Marker: ({
		children,
		position,
	}: {
		children?: React.ReactNode;
		position: [number, number];
	}) => (
		<div data-testid="marker" data-position={JSON.stringify(position)}>
			{children}
		</div>
	),
	Popup: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="popup">{children}</div>
	),
}));

function makeProfessional(
	overrides: Partial<ProfessionalResponse> = {},
): ProfessionalResponse {
	return {
		id: "prof-1",
		name: "Dra. Ana Souza",
		specialty: "CARDIOLOGY",
		latitude: -15.8,
		longitude: -47.9,
		...overrides,
	} as ProfessionalResponse;
}

describe("ProfessionalsMapInner", () => {
	it("renderiza o mapa e a camada de tiles", () => {
		render(<ProfessionalsMapInner professionals={[]} />);
		expect(screen.getByTestId("map-container")).toBeInTheDocument();
		expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
	});

	it("renderiza um marcador apenas para profissionais com latitude/longitude", () => {
		const professionals = [
			makeProfessional({ id: "p1" }),
			makeProfessional({ id: "p2", latitude: null, longitude: null }),
		];
		render(<ProfessionalsMapInner professionals={professionals} />);
		expect(screen.getAllByTestId("marker")).toHaveLength(1);
	});

	it("exibe nome, especialidade e clínica do profissional no popup", () => {
		const professionals = [
			makeProfessional({
				name: "Dr. João Lima",
				specialty: "CARDIOLOGY",
				clinicName: "Clínica Vida",
			}),
		];
		render(<ProfessionalsMapInner professionals={professionals} />);
		expect(screen.getByText("Dr. João Lima")).toBeInTheDocument();
		expect(screen.getByText("Clínica Vida")).toBeInTheDocument();
	});

	it("exibe cidade e estado do profissional quando presentes", () => {
		const professionals = [makeProfessional({ city: "Brasília", state: "DF" })];
		render(<ProfessionalsMapInner professionals={professionals} />);
		expect(screen.getByText("Brasília, DF")).toBeInTheDocument();
	});

	it("usa o centro padrão quando nenhum profissional possui localização", () => {
		const professionals = [
			makeProfessional({ latitude: null, longitude: null }),
		];
		render(<ProfessionalsMapInner professionals={professionals} />);
		expect(screen.getByTestId("map-container")).toHaveAttribute(
			"data-center",
			JSON.stringify([-15.8, -47.9]),
		);
	});
});
