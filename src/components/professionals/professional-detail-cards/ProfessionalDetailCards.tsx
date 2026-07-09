import { ExternalLink, Globe, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfessionalResponse } from "@/features/professionals";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import { ProfessionalContactCard } from "./ProfessionalContactCard";

interface Props {
	professional: ProfessionalResponse;
}

export function ProfessionalDetailCards({ professional }: Props) {
	const hasLinks =
		professional.instagramUrl ||
		professional.linkedinUrl ||
		professional.websiteUrl;
	return (
		<>
			<ProfessionalContactCard professional={professional} />
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Especialidade</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-2">
						{professional.specialty ? (
							<Badge
								variant="secondary"
								className="px-4 py-2 text-sm rounded-full"
							>
								<Stethoscope className="h-3.5 w-3.5 mr-1.5" />
								{SPECIALTY_LABELS[professional.specialty] ??
									professional.specialty}
							</Badge>
						) : (
							<p className="text-sm text-muted-foreground">
								Especialidade não informada.
							</p>
						)}
					</div>
				</CardContent>
			</Card>
			{hasLinks && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Redes sociais</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-3">
						{professional.instagramUrl && (
							<a
								href={professional.instagramUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								<ExternalLink className="h-4 w-4" />
								Instagram
							</a>
						)}
						{professional.linkedinUrl && (
							<a
								href={professional.linkedinUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								<ExternalLink className="h-4 w-4" />
								LinkedIn
							</a>
						)}
						{professional.websiteUrl && (
							<a
								href={professional.websiteUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								<Globe className="h-4 w-4" />
								Website
							</a>
						)}
					</CardContent>
				</Card>
			)}
		</>
	);
}
