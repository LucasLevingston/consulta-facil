"use client";

import { useState } from "react";
import { api } from "@/config/api";
import { env } from "@/env";
import type { AnamnesisInput } from "@/lib/schemas/anamnesis/anamnesis.schema";
import type { AnamnesisMessage } from "@/lib/types/ai";

type ChatMessage = AnamnesisMessage & { id: string };

function makeMsg(role: AnamnesisMessage["role"], content: string): ChatMessage {
	return { id: `${Date.now()}-${Math.random()}`, role, content };
}

export const INITIAL_ANAMNESIS_MESSAGE = makeMsg(
	"assistant",
	"Olá! Sou seu assistente de anamnese. Vou fazer algumas perguntas para ajudar o profissional a entender melhor sua situação antes da consulta. As informações ficam registradas apenas no seu prontuário.\n\nPrimeiro, qual é sua queixa principal hoje? O que motivou essa consulta?",
);

export function useAnamnesisChat() {
	const [messages, setMessages] = useState<ChatMessage[]>([
		INITIAL_ANAMNESIS_MESSAGE,
	]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	function toApiMessages(msgs: ChatMessage[]): AnamnesisMessage[] {
		return msgs.map(({ role, content }) => ({ role, content }));
	}

	async function sendMessage(input: string) {
		const text = input.trim();
		if (!text || isLoading) return;

		const userMsg = makeMsg("user", text);
		const nextMessages = [...messages, userMsg];
		setMessages(nextMessages);
		setIsLoading(true);

		try {
			const token =
				typeof window !== "undefined"
					? localStorage.getItem("authToken")
					: null;
			const response = await fetch(
				`${env.NEXT_PUBLIC_API_URL}/ai/anamnesis/chat`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
					body: JSON.stringify({ messages: toApiMessages(nextMessages) }),
				},
			);

			const reader = response.body?.getReader();
			if (!reader) return;

			const decoder = new TextDecoder();
			const assistantMsg = makeMsg("assistant", "");
			setMessages((prev) => [...prev, assistantMsg]);

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value);
				setMessages((prev) => {
					const last = prev[prev.length - 1];
					return [
						...prev.slice(0, -1),
						{ ...last, content: last.content + chunk },
					];
				});
			}
		} finally {
			setIsLoading(false);
		}
	}

	async function saveAnamnesis(
		onSave: (data: AnamnesisInput) => Promise<void>,
		onClose: () => void,
	) {
		setIsSaving(true);
		try {
			const { data } = await api.post<AnamnesisInput>("/ai/anamnesis/extract", {
				messages: toApiMessages(messages),
			});
			await onSave(data);
			onClose();
		} finally {
			setIsSaving(false);
		}
	}

	return { messages, isLoading, isSaving, sendMessage, saveAnamnesis };
}
