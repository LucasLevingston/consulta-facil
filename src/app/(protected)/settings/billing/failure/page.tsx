"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BillingFailurePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <XCircle className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Pagamento não concluído</h1>
        <p className="text-muted-foreground">
          Houve um problema com o seu pagamento. Nenhuma cobrança foi realizada.
        </p>
      </div>
      <Link href="/settings/billing">
        <Button variant="outline">Tentar novamente</Button>
      </Link>
    </div>
  );
}
