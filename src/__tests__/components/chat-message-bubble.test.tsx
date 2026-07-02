import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/messaging", () => ({}));

import { ChatMessageBubble } from "@/components/messaging/ChatMessageBubble";

const baseMsg = { id: "m-1", content: "Olá!", senderId: "u-1" };

describe("ChatMessageBubble", () => {
	it("renders message content", () => {
		render(
			<ChatMessageBubble msg={baseMsg as never} isOwn={false} msgKey="m-1" />,
		);
		expect(screen.getByText("Olá!")).toBeInTheDocument();
	});

	it("has justify-end class when isOwn=true", () => {
		const { container } = render(
			<ChatMessageBubble msg={baseMsg as never} isOwn={true} msgKey="m-1" />,
		);
		expect(container.firstChild).toHaveClass("justify-end");
	});

	it("has justify-start class when isOwn=false", () => {
		const { container } = render(
			<ChatMessageBubble msg={baseMsg as never} isOwn={false} msgKey="m-1" />,
		);
		expect(container.firstChild).toHaveClass("justify-start");
	});

	it("applies own message bubble style when isOwn=true", () => {
		const { container } = render(
			<ChatMessageBubble msg={baseMsg as never} isOwn={true} msgKey="m-1" />,
		);
		const bubble = container.querySelector(".bg-primary");
		expect(bubble).toBeInTheDocument();
	});

	it("applies muted bubble style when isOwn=false", () => {
		const { container } = render(
			<ChatMessageBubble msg={baseMsg as never} isOwn={false} msgKey="m-1" />,
		);
		const bubble = container.querySelector(".bg-muted");
		expect(bubble).toBeInTheDocument();
	});
});
