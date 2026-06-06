import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CHAT_SYSTEM = `Você é um assistente médico empático da plataforma Consulta Fácil.
Seu objetivo é ajudar o paciente a preencher os campos de anamnese antes de uma consulta.
Converse em português brasileiro de forma acolhedora.
Pergunte UMA coisa por vez, na seguinte ordem:
1. Qual é sua queixa principal hoje? (motivo da consulta)
2. Usa algum medicamento regularmente? Se sim, quais?
3. Tem alguma alergia conhecida (medicamentos, alimentos, outras)?
4. Tem algum histórico médico relevante (doenças, cirurgias, internações)?
5. Há doenças na família que considera importante mencionar?
6. Alguma observação adicional para o profissional?

Após coletar todas as informações, informe o paciente que pode clicar em "Salvar na anamnese".
Não faça diagnósticos. Não substitua consulta médica.`;

const EXTRACT_SYSTEM = `Você receberá uma conversa entre assistente e paciente sobre anamnese médica.
Extraia as informações e retorne APENAS um JSON válido com estes campos (strings, vazio se não mencionado):
{
  "chiefComplaint": "",
  "currentMedications": "",
  "allergies": "",
  "medicalHistory": "",
  "familyHistory": "",
  "observations": ""
}
Responda APENAS o JSON, sem markdown, sem explicação.`;

export type AnamnesisMessage = {
	role: "user" | "assistant";
	content: string;
};

export type AnamnesisChatRequest = {
	messages: AnamnesisMessage[];
	mode: "chat" | "extract";
};

export async function POST(request: Request) {
	const { messages, mode } = (await request.json()) as AnamnesisChatRequest;

	if (mode === "extract") {
		const conversation = messages
			.map(
				(m) => `${m.role === "user" ? "Paciente" : "Assistente"}: ${m.content}`,
			)
			.join("\n");

		const result = await client.messages.create({
			model: "claude-haiku-4-5-20251001",
			max_tokens: 512,
			system: EXTRACT_SYSTEM,
			messages: [{ role: "user", content: conversation }],
		});

		const text =
			result.content[0].type === "text" ? result.content[0].text : "{}";
		try {
			return NextResponse.json(JSON.parse(text));
		} catch {
			return NextResponse.json({});
		}
	}

	// chat mode — streaming
	const stream = await client.messages.stream({
		model: "claude-sonnet-4-6",
		max_tokens: 512,
		system: CHAT_SYSTEM,
		messages: messages.map((m) => ({ role: m.role, content: m.content })),
	});

	const readable = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();
			for await (const chunk of stream) {
				if (
					chunk.type === "content_block_delta" &&
					chunk.delta.type === "text_delta"
				) {
					controller.enqueue(encoder.encode(chunk.delta.text));
				}
			}
			controller.close();
		},
	});

	return new Response(readable, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Transfer-Encoding": "chunked",
		},
	});
}
