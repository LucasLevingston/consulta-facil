import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ClinicsMapInner from "@/components/custom/map/ClinicsMapInner";
import type { ClinicResponse } from "@/features/clinics";

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

function makeClinic(overrides: Partial<ClinicResponse> = {}): ClinicResponse {
	return {
		id: "clinic-1",
		name: "Clínica Saúde Total",
		status: "ACTIVE",
		ownerId: "owner-1",
		latitude: -15.8,
		longitude: -47.9,
		...overrides,
	};
}

describe("ClinicsMapInner", () => {
	it("renderiza o mapa e a camada de tiles", () => {
		render(<ClinicsMapInner clinics={[]} />);
		expect(screen.getByTestId("map-container")).toBeInTheDocument();
		expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
	});

	it("renderiza um marcador apenas para clínicas com latitude/longitude", () => {
		const clinics = [
			makeClinic({ id: "c1" }),
			makeClinic({ id: "c2", latitude: null, longitude: null }),
		];
		render(<ClinicsMapInner clinics={clinics} />);
		expect(screen.getAllByTestId("marker")).toHaveLength(1);
	});

	it("exibe nome, endereço e cidade/estado da clínica no popup", () => {
		const clinics = [
			makeClinic({
				name: "Clínica Vida",
				address: "Rua das Flores, 123",
				city: "Brasília",
				state: "DF",
			}),
		];
		render(<ClinicsMapInner clinics={clinics} />);
		expect(screen.getByText("Clínica Vida")).toBeInTheDocument();
		expect(screen.getByText("Rua das Flores, 123")).toBeInTheDocument();
		expect(screen.getByText("Brasília, DF")).toBeInTheDocument();
	});

	it("exibe a quantidade de profissionais quando a clínica possui membros", () => {
		const clinics = [
			makeClinic({
				members: [
					{ id: "m1", role: "OWNER" } as never,
					{ id: "m2", role: "MEMBER" } as never,
				],
			}),
		];
		render(<ClinicsMapInner clinics={clinics} />);
		expect(
			screen.getByText(
				(_, element) => element?.textContent === "2 profissionalis",
			),
		).toBeInTheDocument();
	});

	it("usa o centro padrão quando nenhuma clínica possui localização", () => {
		const clinics = [makeClinic({ latitude: null, longitude: null })];
		render(<ClinicsMapInner clinics={clinics} />);
		expect(screen.getByTestId("map-container")).toHaveAttribute(
			"data-center",
			JSON.stringify([-15.8, -47.9]),
		);
	});

	it("usa a localização da primeira clínica com coordenadas como centro do mapa", () => {
		const clinics = [makeClinic({ latitude: -23.5, longitude: -46.6 })];
		render(<ClinicsMapInner clinics={clinics} />);
		expect(screen.getByTestId("map-container")).toHaveAttribute(
			"data-center",
			JSON.stringify([-23.5, -46.6]),
		);
	});
});
