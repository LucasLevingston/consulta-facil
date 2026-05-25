import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
	transcript: z.string().min(1),
});

export const voiceBookingResultSchema = z.object({
	specialty: z.string().nullable(),
	professionalName: z.string().nullable(),
	date: z.string().nullable(),
	timePreference: z.enum(["morning", "afternoon", "evening", "any"]).nullable(),
	modality: z.enum(["IN_PERSON", "ONLINE"]).nullable(),
	reason: z.string().nullable(),
	confidence: z.enum(["high", "medium", "low"]),
	summary: z.string(),
});

export type VoiceBookingResult = z.infer<typeof voiceBookingResultSchema>;

export async function POST(req: Request) {
	const body = await req.json().catch(() => ({}));
	const parsed = requestSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Transcrição inválida." },
			{ status: 400 },
		);
	}

	const apiKey = process.env.ANTHROPIC_API_KEY;
	if (!apiKey) {
		return NextResponse.json(
			{ error: "ANTHROPIC_API_KEY não configurada." },
			{ status: 503 },
		);
	}

	const client = new Anthropic({ apiKey });
	const today = new Date().toLocaleDateString("pt-BR", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const message = await client.messages.create({
		model: "claude-haiku-4-5-20251001",
		max_tokens: 512,
		messages: [
			{
				role: "user",
				content: `Você é um assistente de agendamento médico. Hoje é ${today}.

O paciente disse: "${parsed.data.transcript}"

Extraia as informações de agendamento e responda APENAS com JSON válido neste formato exato:
{
  "specialty": "especialidade médica ou null",
  "professionalName": "nome do médico mencionado ou null",
  "date": "data no formato YYYY-MM-DD ou null (converta 'amanhã', 'próxima semana', etc.)",
  "timePreference": "morning|afternoon|evening|any ou null (manhã=morning, tarde=afternoon, noite=evening)",
  "modality": "IN_PERSON|ONLINE ou null",
  "reason": "motivo da consulta em uma frase ou null",
  "confidence": "high|medium|low",
  "summary": "resumo da solicitação em português em uma frase"
}

Responda APENAS com o JSON, sem explicações.`,
			},
		],
	});

	const text =
		message.content[0]?.type === "text" ? message.content[0].text.trim() : "";

	const jsonMatch = text.match(/\{[\s\S]*\}/);
	if (!jsonMatch) {
		return NextResponse.json(
			{ error: "Falha ao processar comando de voz." },
			{ status: 422 },
		);
	}

	const result = voiceBookingResultSchema.safeParse(JSON.parse(jsonMatch[0]));
	if (!result.success) {
		return NextResponse.json(
			{ error: "Resposta da IA em formato inesperado." },
			{ status: 422 },
		);
	}

	return NextResponse.json(result.data);
}
