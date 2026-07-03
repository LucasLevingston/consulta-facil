import { Bot, User } from "lucide-react";

type Message = { id: string; role: "user" | "assistant"; content: string };

interface Props {
	msg: Message;
	isLoading: boolean;
	isLast: boolean;
}

export function AnamnesisMessageBubble({ msg, isLoading, isLast }: Props) {
	return (
		<div
			className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
		>
			<div className="mt-0.5 shrink-0">
				{msg.role === "assistant" ? (
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
						<Bot className="h-3.5 w-3.5" />
					</div>
				) : (
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
						<User className="h-3.5 w-3.5" />
					</div>
				)}
			</div>
			<div
				className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "assistant" ? "bg-card border border-border" : "bg-primary text-primary-foreground"}`}
			>
				{msg.content}
				{isLoading &&
					isLast &&
					msg.role === "assistant" &&
					msg.content === "" && <span className="animate-pulse">...</span>}
			</div>
		</div>
	);
}
