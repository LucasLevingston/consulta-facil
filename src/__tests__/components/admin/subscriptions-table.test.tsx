import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SubscriptionsTable } from "@/components/admin/SubscriptionsTable";
import type { AdminSubscriptionResponse } from "@/features/subscriptions";

function makeSubscription(
	overrides: Partial<AdminSubscriptionResponse> = {},
): AdminSubscriptionResponse {
	return {
		id: "sub-1",
		userEmail: "medico@example.com",
		planName: "Plano Premium",
		ownerType: "PROFESSIONAL",
		status: "ACTIVE",
		expiresAt: "2026-12-31T00:00:00.000Z",
		createdAt: "2026-01-01T00:00:00.000Z",
		...overrides,
	} as AdminSubscriptionResponse;
}

describe("SubscriptionsTable", () => {
	it("renderiza o cabeçalho da tabela", () => {
		render(
			<SubscriptionsTable
				subscriptions={[]}
				onCancel={vi.fn()}
				cancelPending={false}
			/>,
		);
		expect(screen.getByText("Usuário")).toBeInTheDocument();
		expect(screen.getByText("Plano")).toBeInTheDocument();
		expect(screen.getByText("Status")).toBeInTheDocument();
	});

	it("não renderiza nenhuma linha quando a lista está vazia", () => {
		render(
			<SubscriptionsTable
				subscriptions={[]}
				onCancel={vi.fn()}
				cancelPending={false}
			/>,
		);
		expect(screen.getAllByRole("row")).toHaveLength(1); // apenas header
	});

	it("renderiza os dados de uma assinatura", () => {
		render(
			<SubscriptionsTable
				subscriptions={[makeSubscription()]}
				onCancel={vi.fn()}
				cancelPending={false}
			/>,
		);
		expect(screen.getByText("medico@example.com")).toBeInTheDocument();
		expect(screen.getByText("Plano Premium")).toBeInTheDocument();
		expect(screen.getByText("Médico")).toBeInTheDocument();
		expect(screen.getByText("Ativa")).toBeInTheDocument();
	});

	it("mostra travessão quando não há data de expiração", () => {
		render(
			<SubscriptionsTable
				subscriptions={[makeSubscription({ expiresAt: null })]}
				onCancel={vi.fn()}
				cancelPending={false}
			/>,
		);
		expect(screen.getByText("—")).toBeInTheDocument();
	});

	it("mostra o botão Cancelar apenas para assinaturas ativas", () => {
		render(
			<SubscriptionsTable
				subscriptions={[
					makeSubscription({ id: "s1", status: "ACTIVE" }),
					makeSubscription({
						id: "s2",
						status: "CANCELLED",
						userEmail: "b@x.com",
					}),
				]}
				onCancel={vi.fn()}
				cancelPending={false}
			/>,
		);
		expect(screen.getAllByRole("button", { name: /Cancelar/ })).toHaveLength(1);
	});

	it("chama onCancel com a assinatura ao clicar em Cancelar", async () => {
		const user = userEvent.setup();
		const onCancel = vi.fn();
		const sub = makeSubscription();
		render(
			<SubscriptionsTable
				subscriptions={[sub]}
				onCancel={onCancel}
				cancelPending={false}
			/>,
		);
		await user.click(screen.getByRole("button", { name: /Cancelar/ }));
		expect(onCancel).toHaveBeenCalledWith(sub);
	});

	it("desabilita o botão Cancelar quando cancelPending=true", () => {
		render(
			<SubscriptionsTable
				subscriptions={[makeSubscription()]}
				onCancel={vi.fn()}
				cancelPending={true}
			/>,
		);
		expect(screen.getByRole("button", { name: /Cancelar/ })).toBeDisabled();
	});

	it("usa o status como label quando não há configuração conhecida", () => {
		render(
			<SubscriptionsTable
				subscriptions={[makeSubscription({ status: "UNKNOWN_STATUS" })]}
				onCancel={vi.fn()}
				cancelPending={false}
			/>,
		);
		expect(screen.getByText("UNKNOWN_STATUS")).toBeInTheDocument();
	});
});
