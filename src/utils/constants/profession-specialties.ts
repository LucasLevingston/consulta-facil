export const PROFESSION_SPECIALTIES: Record<string, string[]> = {
	Médico: [
		"Cardiologia",
		"Clínica Geral",
		"Dermatologia",
		"Endocrinologia",
		"Gastroenterologia",
		"Neurologia",
		"Oftalmologia",
		"Ortopedia",
		"Pediatria",
		"Pneumologia",
		"Psiquiatria",
	],
	Nutricionista: [
		"Nutrição Clínica",
		"Nutrição Esportiva",
		"Nutrição Funcional",
		"Nutrição Materno-Infantil",
		"Nutrição Oncológica",
	],
	Fisioterapeuta: [
		"Fisioterapia Desportiva",
		"Fisioterapia Neurológica",
		"Fisioterapia Ortopédica",
		"Fisioterapia Respiratória",
		"Pilates Clínico",
	],
	Psicólogo: [
		"Psicologia do Esporte",
		"Psicologia Infantil",
		"Psicologia Organizacional",
		"Psicanálise",
		"TCC",
	],
};

export const professions = Object.keys(PROFESSION_SPECIALTIES);

export const specialties = Object.values(PROFESSION_SPECIALTIES).flat().sort();
