"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BillingPendingPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10">
        <Clock className="h-10 w-10 text-yellow-500" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Pagamento em processamento</h1>
        <p className="text-muted-foreground">
          Seu pagamento está sendo processado. Você receberá uma confirmação em breve.
        </p>
      </div>
      <Link href="/dashboard">
        <Button variant="outline">Voltar ao dashboard</Button>
      </Link>
    </div>
  );
}
