import type { AnamnesisMessage } from "@/lib/types/ai";

type ChatMessage = AnamnesisMessage & { id: string };

export const INITIAL_ANAMNESIS_MESSAGE: ChatMessage = {
	id: "anamnesis-initial",
	role: "assistant",
	content:
		"Olá! Sou seu assistente de anamnese. Vou fazer algumas perguntas para ajudar o profissional a entender melhor sua situação antes da consulta. As informações ficam registradas apenas no seu prontuário.\n\nPrimeiro, qual é sua queixa principal hoje? O que motivou essa consulta?",
};
