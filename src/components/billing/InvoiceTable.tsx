"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { InvoiceResponse } from "@/lib/schemas/billing/invoice.schema";

interface InvoiceTableProps {
	invoices: InvoiceResponse[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
	if (invoices.length === 0) {
		return (
			<p className="text-center text-muted-foreground py-8">
				Nenhuma nota fiscal encontrada.
			</p>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Número</TableHead>
					<TableHead>Pagamento</TableHead>
					<TableHead>Data</TableHead>
					<TableHead>Ações</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{invoices.map((inv) => (
					<TableRow key={inv.id}>
						<TableCell className="font-mono">{inv.invoiceNumber}</TableCell>
						<TableCell className="text-muted-foreground text-xs">
							{inv.paymentId}
						</TableCell>
						<TableCell>
							{new Date(inv.createdAt).toLocaleDateString("pt-BR")}
						</TableCell>
						<TableCell>
							{inv.hostedUrl && (
								<Button size="sm" variant="outline" asChild>
									<a
										href={inv.hostedUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="h-3 w-3 mr-1" />
										Ver
									</a>
								</Button>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
