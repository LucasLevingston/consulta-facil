import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface Props {
	value?: string;
	onChange: (v: "IN_PERSON" | "ONLINE") => void;
}

export function ProcedureModalitySelect({ value, onChange }: Props) {
	return (
		<Select
			onValueChange={(v) => onChange(v as "IN_PERSON" | "ONLINE")}
			value={value ?? ""}
		>
			<SelectTrigger>
				<SelectValue placeholder="Selecione (opcional)" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="IN_PERSON">Presencial</SelectItem>
				<SelectItem value="ONLINE">Online</SelectItem>
			</SelectContent>
		</Select>
	);
}
