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
