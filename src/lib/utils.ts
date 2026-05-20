import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getLabelByFormName(name: string): string {
	const labels: Record<string, string> = {
		email: "E-mail",
		password: "Senha",
		confirmPassword: "Confirmar Senha",
		name: "Nome",
		age: "Idade",
		phone: "Telefone",
		cpf: "CPF",
		address: "Endereço",
		specialty: "Especialidade",
		licenseNumber: "Número de Registro",
		birthDate: "Data de Nascimento",
		scheduledAt: "Data da Consulta",
		doctorId: "Profissional",
		reason: "Motivo",
		notes: "Observações",
		cancellationReason: "Motivo do Cancelamento",
		occupation: "Ocupação",
		emergencyContactName: "Contato de Emergência",
		emergencyContactNumber: "Telefone de Emergência",
		allergies: "Alergias",
		currentMedication: "Medicamentos Atuais",
		familyMedicalHistory: "Histórico Familiar",
		pastMedicalHistory: "Histórico Médico",
		identificationDocumentType: "Tipo de Documento",
		identificationDocument: "Documento",
	};
	return labels[name] || name;
}

export function getPlaceholderByFormName(name: string): string {
	const placeholders: Record<string, string> = {
		email: "seu@exemplo.com",
		password: "••••••",
		confirmPassword: "••••••",
		name: "Digite seu nome",
		phone: "(11) 99999-9999",
		cpf: "000.000.000-00",
		address: "Rua, Número, Cidade",
	};
	return placeholders[name] || "";
}

export function convertFileToUrl(file: File): string {
	return URL.createObjectURL(file);
}

export function formatDateTime(date: Date) {
	return {
		dateTime: format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }),
		dateOnly: format(date, "dd/MM/yyyy", { locale: ptBR }),
		timeOnly: format(date, "HH:mm", { locale: ptBR }),
	};
}
