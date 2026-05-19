import PageHeader from "@/components/custom/page-header";
import { PageLayout } from "@/components/custom/page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeForm } from "./_componens/form";

export default function ThemePage() {
	return (
		<PageLayout>
			<PageHeader title="Tema" description="Configure o tema do painel." />
			<Card>
				<CardHeader>
					<CardTitle>Aparência</CardTitle>
					<CardDescription>Selecione o tema para o painel.</CardDescription>
				</CardHeader>
				<CardContent>
					<ThemeForm />
				</CardContent>
			</Card>
		</PageLayout>
	);
}
