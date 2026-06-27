export interface ServiceSelectorProps {
	professionalId: string;
	consultationPrice: number | null | undefined;
	value: string | null;
	onChange: (id: string | null) => void;
}
