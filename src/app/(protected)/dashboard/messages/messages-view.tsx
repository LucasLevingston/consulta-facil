"use client";

import { ArrowLeft } from "lucide-react";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { ChatThread } from "@/components/messaging/ChatThread";
import { ConversationList } from "@/components/messaging/ConversationList";
import { Button } from "@/components/ui/button";
import { useMessagesPage } from "@/features/messaging";
import { cn } from "@/lib/utils/cn";

function MessagesContent() {
	const {
		conversations,
		selected,
		selectedId,
		mobileShowThread,
		setMobileShowThread,
		handleSelect,
	} = useMessagesPage();

	return (
		<div className="flex h-[calc(100vh-4rem)] overflow-hidden border rounded-lg">
			<div
				className={cn(
					"w-full md:w-80 border-r flex flex-col shrink-0",
					mobileShowThread && "hidden md:flex",
				)}
			>
				<div className="px-4 py-3 border-b">
					<h2 className="font-semibold">Mensagens</h2>
				</div>
				<div className="flex-1 overflow-y-auto">
					<ConversationList
						conversations={conversations}
						selectedId={selectedId}
						onSelect={handleSelect}
					/>
				</div>
			</div>

			<div
				className={cn(
					"flex-1 flex flex-col",
					!mobileShowThread && "hidden md:flex",
				)}
			>
				{selected ? (
					<>
						<div className="md:hidden px-2 py-1 border-b">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setMobileShowThread(false)}
								className="gap-1"
							>
								<ArrowLeft className="h-4 w-4" />
								Voltar
							</Button>
						</div>
						<ChatThread conversation={selected} />
					</>
				) : (
					<div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
						Selecione uma conversa
					</div>
				)}
			</div>
		</div>
	);
}

export function MessagesView() {
	return (
		<SuspenseBoundary>
			<MessagesContent />
		</SuspenseBoundary>
	);
}
