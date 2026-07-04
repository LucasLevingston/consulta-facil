import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/dialog", () => ({
	Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
		open ? <div>{children}</div> : null,
	DialogContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogTitle: ({ children }: { children: React.ReactNode }) => (
		<h2>{children}</h2>
	),
	DialogDescription: ({ children }: { children: React.ReactNode }) => (
		<p>{children}</p>
	),
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
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const mockMutateInvite = vi.fn();
const mockUseSendClinicInvite = vi.fn(() => ({
	mutate: mockMutateInvite,
	isPending: false,
}));
vi.mock("@/features/notifications", () => ({
	useSendClinicInvite: () => mockUseSendClinicInvite(),
}));

const mockUseProfessionals = vi.fn();
vi.mock("@/features/professionals", () => ({
	useProfessionals: (...args: unknown[]) => mockUseProfessionals(...args),
}));

const mockMutateRemove = vi.fn();
const mockUseRemoveClinicMember = vi.fn(() => ({
	mutate: mockMutateRemove,
	isPending: false,
}));
vi.mock("@/features/clinics", () => ({
	useRemoveClinicMember: () => mockUseRemoveClinicMember(),
}));

import { toast } from "sonner";
import { ClinicMemberCard } from "@/components/clinic/ClinicMemberCard";
import { ClinicMembersInviteDialog } from "@/components/clinic/ClinicMembersInviteDialog";
import { ClinicMembersTab } from "@/components/clinic/ClinicMembersTab";
import type { ClinicResponse } from "@/features/clinics";
import type { ProfessionalResponse } from "@/features/professionals";

type Member = NonNullable<ClinicResponse["members"]>[number];

const owner: Member = {
	professionalProfileId: "prof-1",
	professionalName: "Dr. João",
	specialty: "CARDIOLOGIA",
	imageUrl: null,
	role: "OWNER",
};

const regularMember: Member = {
	professionalProfileId: "prof-2",
	professionalName: "Dra. Ana",
	specialty: "ORTOPEDIA",
	imageUrl: null,
	role: "MEMBER",
};

describe("ClinicMemberCard", () => {
	it("renders nome do profissional e especialidade", () => {
		render(
			<ClinicMemberCard
				member={regularMember}
				isManager={false}
				isCurrentUser={false}
				isRemoving={false}
				onRemove={vi.fn()}
			/>,
		);
		expect(screen.getByText("Dra. Ana")).toBeInTheDocument();
		expect(screen.getByText("Ortopedia")).toBeInTheDocument();
	});

	it("renders badge de Proprietário quando role=OWNER", () => {
		render(
			<ClinicMemberCard
				member={owner}
				isManager={false}
				isCurrentUser={false}
				isRemoving={false}
				onRemove={vi.fn()}
			/>,
		);
		expect(screen.getByText("Proprietário")).toBeInTheDocument();
	});

	it("mostra botão remover quando isManager=true e não é proprietário/usuário atual", () => {
		render(
			<ClinicMemberCard
				member={regularMember}
				isManager={true}
				isCurrentUser={false}
				isRemoving={false}
				onRemove={vi.fn()}
			/>,
		);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("esconde botão remover quando membro é o proprietário", () => {
		render(
			<ClinicMemberCard
				member={owner}
				isManager={true}
				isCurrentUser={false}
				isRemoving={false}
				onRemove={vi.fn()}
			/>,
		);
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("chama onRemove ao clicar no botão remover", async () => {
		const onRemove = vi.fn();
		render(
			<ClinicMemberCard
				member={regularMember}
				isManager={true}
				isCurrentUser={false}
				isRemoving={false}
				onRemove={onRemove}
			/>,
		);
		await userEvent.click(screen.getByRole("button"));
		expect(onRemove).toHaveBeenCalledTimes(1);
	});

	it("desabilita botão quando isRemoving=true", () => {
		render(
			<ClinicMemberCard
				member={regularMember}
				isManager={true}
				isCurrentUser={false}
				isRemoving={true}
				onRemove={vi.fn()}
			/>,
		);
		expect(screen.getByRole("button")).toBeDisabled();
	});
});

const professionals: ProfessionalResponse[] = [
	{
		id: "p-1",
		name: "Dr. Carlos",
		specialty: "CARDIOLOGIA",
		status: "ACTIVE",
		imageUrl: null,
	} as unknown as ProfessionalResponse,
	{
		id: "p-2",
		name: "Dra. Bia",
		specialty: "ORTOPEDIA",
		status: "ACTIVE",
		imageUrl: null,
	} as unknown as ProfessionalResponse,
	{
		id: "p-3",
		name: "Dr. Inativo",
		specialty: "CARDIOLOGIA",
		status: "PENDING",
		imageUrl: null,
	} as unknown as ProfessionalResponse,
];

describe("ClinicMembersInviteDialog", () => {
	it("não renderiza nada quando open=false", () => {
		mockUseProfessionals.mockReturnValue({ data: { content: professionals } });
		const { container } = render(
			<ClinicMembersInviteDialog
				clinicId="c-1"
				memberIds={new Set()}
				open={false}
				onOpenChange={vi.fn()}
			/>,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renders título e descrição quando open=true", () => {
		mockUseProfessionals.mockReturnValue({ data: { content: professionals } });
		render(
			<ClinicMembersInviteDialog
				clinicId="c-1"
				memberIds={new Set()}
				open={true}
				onOpenChange={vi.fn()}
			/>,
		);
		expect(screen.getByText("Convidar profissional")).toBeInTheDocument();
		expect(
			screen.getByText(/receberá uma notificação para aceitar/),
		).toBeInTheDocument();
	});

	it("filtra profissionais que já são membros e inativos", () => {
		mockUseProfessionals.mockReturnValue({ data: { content: professionals } });
		render(
			<ClinicMembersInviteDialog
				clinicId="c-1"
				memberIds={new Set(["p-1"])}
				open={true}
				onOpenChange={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Dr. Carlos")).not.toBeInTheDocument();
		expect(screen.queryByText("Dr. Inativo")).not.toBeInTheDocument();
		expect(screen.getByText("Dra. Bia")).toBeInTheDocument();
	});

	it("filtra por busca de texto", async () => {
		mockUseProfessionals.mockReturnValue({ data: { content: professionals } });
		render(
			<ClinicMembersInviteDialog
				clinicId="c-1"
				memberIds={new Set()}
				open={true}
				onOpenChange={vi.fn()}
			/>,
		);
		await userEvent.type(
			screen.getByPlaceholderText("Buscar por nome ou especialidade..."),
			"Bia",
		);
		expect(screen.getByText("Dra. Bia")).toBeInTheDocument();
		expect(screen.queryByText("Dr. Carlos")).not.toBeInTheDocument();
	});

	it("chama mutation de convite ao selecionar profissional e mostra toast de sucesso", async () => {
		mockUseProfessionals.mockReturnValue({ data: { content: professionals } });
		mockMutateInvite.mockImplementation((_vars, opts) => {
			opts?.onSuccess?.();
		});
		const onOpenChange = vi.fn();
		render(
			<ClinicMembersInviteDialog
				clinicId="c-1"
				memberIds={new Set()}
				open={true}
				onOpenChange={onOpenChange}
			/>,
		);
		await userEvent.click(screen.getByText("Dra. Bia"));
		expect(mockMutateInvite).toHaveBeenCalledWith(
			{ clinicId: "c-1", professionalProfileId: "p-2" },
			expect.any(Object),
		);
		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"Convite enviado ao profissional.",
			);
		});
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("mostra toast de erro quando a mutation falha", async () => {
		mockUseProfessionals.mockReturnValue({ data: { content: professionals } });
		mockMutateInvite.mockImplementation((_vars, opts) => {
			opts?.onError?.();
		});
		render(
			<ClinicMembersInviteDialog
				clinicId="c-1"
				memberIds={new Set()}
				open={true}
				onOpenChange={vi.fn()}
			/>,
		);
		await userEvent.click(screen.getByText("Dra. Bia"));
		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith("Erro ao enviar convite.");
		});
	});
});

describe("ClinicMembersTab", () => {
	it("renders mensagem quando não há membros", () => {
		mockUseProfessionals.mockReturnValue({ data: { content: [] } });
		const clinic = { id: "c-1", members: [] } as unknown as ClinicResponse;
		render(
			<ClinicMembersTab
				clinic={clinic}
				isManager={false}
				currentUserId="u-1"
			/>,
		);
		expect(
			screen.getByText("Nenhum profissional cadastrado nesta clínica."),
		).toBeInTheDocument();
	});

	it("renders um card por membro", () => {
		mockUseProfessionals.mockReturnValue({ data: { content: [] } });
		const clinic = {
			id: "c-1",
			members: [owner, regularMember],
		} as unknown as ClinicResponse;
		render(
			<ClinicMembersTab
				clinic={clinic}
				isManager={false}
				currentUserId="u-1"
			/>,
		);
		expect(screen.getByText("Dr. João")).toBeInTheDocument();
		expect(screen.getByText("Dra. Ana")).toBeInTheDocument();
	});

	it("mostra botão Convidar profissional quando isManager=true", () => {
		mockUseProfessionals.mockReturnValue({ data: { content: [] } });
		const clinic = {
			id: "c-1",
			members: [owner],
		} as unknown as ClinicResponse;
		render(
			<ClinicMembersTab clinic={clinic} isManager={true} currentUserId="u-1" />,
		);
		expect(screen.getByText("Convidar profissional")).toBeInTheDocument();
	});

	it("esconde botão Convidar profissional quando isManager=false", () => {
		mockUseProfessionals.mockReturnValue({ data: { content: [] } });
		const clinic = {
			id: "c-1",
			members: [owner],
		} as unknown as ClinicResponse;
		render(
			<ClinicMembersTab
				clinic={clinic}
				isManager={false}
				currentUserId="u-1"
			/>,
		);
		expect(screen.queryByText("Convidar profissional")).not.toBeInTheDocument();
	});

	it("abre o dialog de convite ao clicar em Convidar profissional", async () => {
		mockUseProfessionals.mockReturnValue({ data: { content: professionals } });
		const clinic = {
			id: "c-1",
			members: [owner],
		} as unknown as ClinicResponse;
		render(
			<ClinicMembersTab clinic={clinic} isManager={true} currentUserId="u-1" />,
		);
		await userEvent.click(screen.getByText("Convidar profissional"));
		expect(
			screen.getByText(/receberá uma notificação para aceitar/),
		).toBeInTheDocument();
	});

	it("chama a mutation de remoção ao remover um membro", async () => {
		mockUseProfessionals.mockReturnValue({ data: { content: [] } });
		mockMutateRemove.mockImplementation((_vars, opts) => {
			opts?.onSuccess?.();
		});
		const clinic = {
			id: "c-1",
			ownerId: "owner-id",
			members: [regularMember],
		} as unknown as ClinicResponse;
		render(
			<ClinicMembersTab clinic={clinic} isManager={true} currentUserId="u-1" />,
		);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[buttons.length - 1]);
		expect(mockMutateRemove).toHaveBeenCalledWith(
			{ clinicId: "c-1", professionalProfileId: "prof-2" },
			expect.any(Object),
		);
	});
});
