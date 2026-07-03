import { Loader2, Navigation, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface Props {
	isNearbyMode: boolean;
	radiusKm: number;
	locationLoading: boolean;
	radiusOptions: ReadonlyArray<{ value: string; label: string }>;
	onSetRadiusKm: (v: number) => void;
	onClearLocation: () => void;
	onRequestLocation: () => void;
}

export function ProfessionalsNearbyControl({
	isNearbyMode,
	radiusKm,
	locationLoading,
	radiusOptions,
	onSetRadiusKm,
	onClearLocation,
	onRequestLocation,
}: Props) {
	if (isNearbyMode) {
		return (
			<div className="flex items-center gap-2">
				<Select
					value={String(radiusKm)}
					onValueChange={(v) => onSetRadiusKm(Number(v))}
				>
					<SelectTrigger className="h-9 w-[100px] rounded-xl text-sm">
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						{radiusOptions.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Badge
					variant="secondary"
					className="gap-1.5 rounded-full px-3 py-1.5 text-sm"
				>
					<Navigation className="h-3.5 w-3.5 text-primary" />
					Perto de você
					<button
						type="button"
						onClick={onClearLocation}
						className="ml-0.5 transition-opacity hover:opacity-70"
					>
						<X className="h-3.5 w-3.5" />
					</button>
				</Badge>
			</div>
		);
	}
	return (
		<Button
			variant="outline"
			size="sm"
			onClick={onRequestLocation}
			disabled={locationLoading}
			className="gap-2 rounded-xl"
		>
			{locationLoading ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Navigation className="h-4 w-4" />
			)}
			Perto de mim
		</Button>
	);
}
