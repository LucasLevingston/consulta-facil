import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const mapProps = vi.hoisted(() => vi.fn());
vi.mock("@/components/custom/map/ProfessionalsMap", () => ({
	ProfessionalsMap: (props: unknown) => {
		mapProps(props);
		return <div>mapa</div>;
	},
}));
vi.mock("@/components/custom/professional/ProfessionalsList", () => ({
	default: ({ professionals }: { professionals: unknown[] }) => (
		<div>{professionals.length} profissionais na lista</div>
	),
}));
vi.mock("@/components/custom/custom-pagination", () => ({
	CustomPagination: ({
		currentPage,
		totalPages,
		onPageChange,
	}: {
		currentPage: number;
		totalPages: number;
		onPageChange: (p: number) => void;
	}) => (
		<button type="button" onClick={() => onPageChange(currentPage + 1)}>
			página {currentPage + 1} de {totalPages}
		</button>
	),
}));

import { ProfessionalsViewContent } from "./ProfessionalsViewContent";

const professionals = [{ id: "p1" }, { id: "p2" }] as never[];
const base = {
	viewMode: "list" as const,
	displayed: professionals,
	professionalsWithLocation: professionals,
	isNearbyMode: false,
	currentPage: 0,
	totalPages: 3,
	userLocation: null,
	onPageChange: vi.fn(),
};

describe("ProfessionalsViewContent", () => {
	it("lists professionals with pagination in list mode", async () => {
		const onPageChange = vi.fn();
		render(<ProfessionalsViewContent {...base} onPageChange={onPageChange} />);

		expect(screen.getByText("2 profissionais na lista")).toBeInTheDocument();
		await userEvent.click(
			screen.getByRole("button", { name: "página 1 de 3" }),
		);
		expect(onPageChange).toHaveBeenCalledWith(1);
	});

	it("hides pagination for nearby results", () => {
		render(<ProfessionalsViewContent {...base} isNearbyMode />);

		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("centers the map on the user when the location is known", () => {
		render(
			<ProfessionalsViewContent
				{...base}
				viewMode="map"
				userLocation={{ lat: -8.05, lng: -34.9 }}
			/>,
		);

		expect(screen.getByText("mapa")).toBeInTheDocument();
		expect(mapProps).toHaveBeenLastCalledWith(
			expect.objectContaining({ center: [-8.05, -34.9], zoom: 10 }),
		);
	});

	it("uses the country-wide view without a location and warns when nobody has one", () => {
		render(
			<ProfessionalsViewContent
				{...base}
				viewMode="map"
				professionalsWithLocation={[]}
			/>,
		);

		expect(mapProps).toHaveBeenLastCalledWith(
			expect.objectContaining({ center: undefined, zoom: 5 }),
		);
		expect(
			screen.getByText(/Nenhum profissional com localização cadastrada/),
		).toBeInTheDocument();
	});
});
