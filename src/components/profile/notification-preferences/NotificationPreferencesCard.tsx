"use client";

import { MessageCircle } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUserStore } from "@/features/auth";
import { useUpdateNotificationPreferences } from "./use-update-notification-preferences";

export function NotificationPreferencesCard() {
	const { user } = useUserStore();
	const { mutate, isPending } = useUpdateNotificationPreferences();
	// Opt-out model: users who never touched the setting receive messages.
	const whatsappEnabled = user?.whatsappNotificationsEnabled ?? true;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Notificações</CardTitle>
				<CardDescription>
					Escolha como quer receber avisos sobre suas consultas.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-start gap-3">
						<MessageCircle className="mt-0.5 h-5 w-5 text-muted-foreground" />
						<div>
							<Label htmlFor="whatsapp-notifications">
								Mensagens pelo WhatsApp
							</Label>
							<p className="text-sm text-muted-foreground">
								Confirmações, cancelamentos e lembretes de consulta.
							</p>
						</div>
					</div>
					<Switch
						id="whatsapp-notifications"
						checked={whatsappEnabled}
						disabled={isPending || !user}
						onCheckedChange={(checked) =>
							mutate({ whatsappNotificationsEnabled: checked })
						}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
