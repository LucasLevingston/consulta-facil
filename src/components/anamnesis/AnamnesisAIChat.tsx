"use client";

import { Bot, Send, ShieldAlert, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CustomButton } from "@/components/custom/custom-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useAnamnesisChat } from "@/hooks/use-anamnesis-chat";
import type { AnamnesisAIChatProps } from "./AnamnesisAIChat.types";

export function AnamnesisAIChat({ onSave, onClose }: AnamnesisAIChatProps) {
	const { messages, isLoading, isSaving, sendMessage, saveAnamnesis } =
		useAnamnesisChat();
	const [input, setInput] = useState("");
	const bottomRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
	useEffect(() => {
		if (messages.length > 0) {
			bottomRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	async function handleSend() {
		await sendMessage(input);
		setInput("");
	}

	return (
		<div className="flex flex-col gap-4">
			<Alert className="rounded-xl border-amber-500/20 bg-amber-500/5">
				<ShieldAlert className="h-4 w-4 text-amber-500" />
				<AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
					Este assistente de IA é apenas um auxiliar para coletar informações.
					Não substitui avaliação médica. Não compartilhe dados sensíveis além
					do solicitado.
				</AlertDescription>
			</Alert>

			<ScrollArea className="h-72 rounded-xl border border-border bg-muted/20 p-3">
				<div className="space-y-3 pr-2">
					{messages.map((msg, i) => (
						<div
							key={msg.id}
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
								className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
									msg.role === "assistant"
										? "bg-card border border-border"
										: "bg-primary text-primary-foreground"
								}`}
							>
								{msg.content}
								{isLoading &&
									i === messages.length - 1 &&
									msg.role === "assistant" &&
									msg.content === "" && (
										<span className="animate-pulse">...</span>
									)}
							</div>
						</div>
					))}
					<div ref={bottomRef} />
				</div>
			</ScrollArea>

			<div className="flex gap-2">
				<Textarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSend();
						}
					}}
					placeholder="Digite sua resposta..."
					rows={2}
					className="resize-none rounded-xl border-border text-sm"
					disabled={isLoading}
				/>
				<Button
					type="button"
					size="icon"
					className="h-auto shrink-0 rounded-xl"
					onClick={handleSend}
					disabled={isLoading || !input.trim()}
				>
					<Send className="h-4 w-4" />
				</Button>
			</div>

			<div className="flex gap-2 pt-1">
				<CustomButton
					onClick={() => saveAnamnesis(onSave, onClose)}
					disabled={isSaving || messages.length < 3}
					className="flex-1"
				>
					{isSaving ? "Salvando..." : "Salvar na anamnese"}
				</CustomButton>
				<CustomButton variant="ghost" onClick={onClose}>
					Cancelar
				</CustomButton>
			</div>
		</div>
	);
}
