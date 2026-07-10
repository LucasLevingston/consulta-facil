import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/professionals", () => ({}));
vi.mock("@/utils/constants/profession-specialties", () => ({
	SPECIALTY_LABELS: { CARDIOLOGY: "Cardiologia", ORTHOPEDICS: "Ortopedia" },
}));
vi.mock("@/components/ui/avatar", () => ({
	Avatar: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	AvatarImage: () => null,
	AvatarFallback: ({ children }: { children: React.ReactNode }) => (
		<span>{children}</span>
	),
}));

import { ClinicMemberInviteList } from "./ClinicMemberInviteList";

const professionals = [
	{ id: "p-1", name: "Dr. João", specialty: "CARDIOLOGY", imageUrl: null },
	{ id: "p-2", name: "Dra. Ana", specialty: "ORTHOPEDICS", imageUrl: null },
];

describe("ClinicMemberInviteList", () => {
	it("renders empty message when no professionals", () => {
		render(
			<ClinicMemberInviteList
				professionals={[]}
				isPending={false}
				onAdd={vi.fn()}
			/>,
		);
		expect(
			screen.getByText(/Nenhum profissional disponível/),
		).toBeInTheDocument();
	});

	it("renders professional names", () => {
		render(
			<ClinicMemberInviteList
				professionals={professionals as never}
				isPending={false}
				onAdd={vi.fn()}
			/>,
		);
		expect(screen.getByText("Dr. João")).toBeInTheDocument();
		expect(screen.getByText("Dra. Ana")).toBeInTheDocument();
	});

	it("renders specialty labels", () => {
		render(
			<ClinicMemberInviteList
				professionals={professionals as never}
				isPending={false}
				onAdd={vi.fn()}
			/>,
		);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
		expect(screen.getByText("Ortopedia")).toBeInTheDocument();
	});

	it("calls onAdd with professional id on click", async () => {
		const onAdd = vi.fn();
		render(
			<ClinicMemberInviteList
				professionals={professionals as never}
				isPending={false}
				onAdd={onAdd}
			/>,
		);
		await userEvent.click(screen.getByText("Dr. João"));
		expect(onAdd).toHaveBeenCalledWith("p-1");
	});

	it("disables buttons when isPending=true", () => {
		render(
			<ClinicMemberInviteList
				professionals={professionals as never}
				isPending={true}
				onAdd={vi.fn()}
			/>,
		);
		const buttons = screen.getAllByRole("button");
		for (const btn of buttons) {
			expect(btn).toBeDisabled();
		}
	});
});
