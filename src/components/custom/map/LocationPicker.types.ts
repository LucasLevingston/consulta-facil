export interface LocationPickerProps {
	lat: number | null;
	lng: number | null;
	onLocationSelect: (lat: number, lng: number) => void;
	className?: string;
}
