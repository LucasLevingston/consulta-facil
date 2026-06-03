import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateTime(date: Date) {
	return {
		dateTime: format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }),
		dateOnly: format(date, "dd/MM/yyyy", { locale: ptBR }),
		timeOnly: format(date, "HH:mm", { locale: ptBR }),
	};
}
