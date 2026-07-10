import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DOCUMENT_TYPE_LABELS,
	type DocumentType,
	documentTypeSchema,
} from "@/features/patients";

interface Props {
	value: DocumentType;
	onChange: (v: DocumentType) => void;
}

export function DocumentTypeSelect({ value, onChange }: Props) {
	return (
		<Select
			value={value}
			onValueChange={(v) => onChange(documentTypeSchema.parse(v))}
		>
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => (
					<SelectItem key={k} value={k}>
						{v}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
