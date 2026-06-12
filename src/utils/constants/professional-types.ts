export const PROFESSIONAL_TYPE_LABELS: Record<string, string> = {
	MEDICO: "Médico",
	DENTISTA: "Dentista",
	FISIOTERAPEUTA: "Fisioterapeuta",
	PSICOLOGO: "Psicólogo",
	NUTRICIONISTA: "Nutricionista",
	ENFERMEIRO: "Enfermeiro",
	FONOAUDIOLOGO: "Fonoaudiólogo",
	TERAPEUTA_OCUPACIONAL: "Terapeuta Ocupacional",
	FARMACEUTICO: "Farmacêutico",
	EDUCADOR_FISICO: "Educador Físico",
	BIOMEDICO: "Biomédico",
	ASSISTENTE_SOCIAL: "Assistente Social",
	VETERINARIO: "Veterinário",
};

export const PROFESSIONAL_TYPE_OPTIONS = Object.entries(
	PROFESSIONAL_TYPE_LABELS,
).map(([value, label]) => ({ value, label }));
