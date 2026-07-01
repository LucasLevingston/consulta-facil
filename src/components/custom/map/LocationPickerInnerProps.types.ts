export interface LocationPickerInnerProps {
	lat: number | null;
	lng: number | null;
	onLocationSelect: (lat: number, lng: number) => void;
}
