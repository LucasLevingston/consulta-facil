"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CopyReferralButtonProps {
	code: string;
}

export function CopyReferralButton({ code }: CopyReferralButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Button variant="outline" size="sm" onClick={handleCopy}>
			{copied ? (
				<>
					<Check className="h-4 w-4 mr-1" />
					Copiado!
				</>
			) : (
				<>
					<Copy className="h-4 w-4 mr-1" />
					Copiar
				</>
			)}
		</Button>
	);
}
