import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
	privacyConsent?: boolean | null;
	treatmentConsent?: boolean | null;
	disclosureConsent?: boolean | null;
}

export function MedicalConsentBadges({
	privacyConsent,
	treatmentConsent,
	disclosureConsent,
}: Props) {
	const count = [privacyConsent, treatmentConsent, disclosureConsent].filter(
		Boolean,
	).length;
	if (count === 0) return null;
	return (
		<>
			<Separator />
			<div className="flex flex-wrap gap-2">
				{privacyConsent && (
					<Badge variant="outline" className="text-xs gap-1">
						<Shield className="h-3 w-3" /> Privacidade
					</Badge>
				)}
				{treatmentConsent && (
					<Badge variant="outline" className="text-xs gap-1">
						<Shield className="h-3 w-3" /> Tratamento
					</Badge>
				)}
				{disclosureConsent && (
					<Badge variant="outline" className="text-xs gap-1">
						<Shield className="h-3 w-3" /> Divulgação
					</Badge>
				)}
			</div>
		</>
	);
}
