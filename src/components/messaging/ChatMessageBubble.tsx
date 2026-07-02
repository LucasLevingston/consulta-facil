import type { MessageResponse } from "@/features/messaging";
import { cn } from "@/lib/utils/cn";

interface Props {
	msg: MessageResponse;
	isOwn: boolean;
	msgKey: string;
}

export function ChatMessageBubble({ msg, isOwn, msgKey }: Props) {
	return (
		<div
			key={msgKey}
			className={cn("flex", isOwn ? "justify-end" : "justify-start")}
		>
			<div
				className={cn(
					"max-w-[70%] rounded-2xl px-4 py-2 text-sm",
					isOwn
						? "rounded-br-sm bg-primary text-primary-foreground"
						: "rounded-bl-sm bg-muted",
				)}
			>
				{msg.content}
			</div>
		</div>
	);
}
