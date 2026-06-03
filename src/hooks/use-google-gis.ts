"use client";

import { useCallback, useEffect } from "react";

declare global {
	interface Window {
		google?: {
			accounts: {
				id: {
					initialize: (config: {
						client_id: string;
						callback: (response: { credential: string }) => void;
						auto_select?: boolean;
					}) => void;
					prompt: () => void;
					renderButton: (
						element: HTMLElement,
						options: { theme: string; size: string; width?: number },
					) => void;
				};
			};
		};
	}
}

export function useGoogleGIS(
	clientId: string | undefined,
	onCredential: (idToken: string) => void,
) {
	const isAvailable = !!clientId;

	useEffect(() => {
		if (!clientId) return;

		const cid = clientId;
		const scriptId = "google-gis-script";
		if (document.getElementById(scriptId)) {
			initGoogle(cid, onCredential);
			return;
		}

		const script = document.createElement("script");
		script.id = scriptId;
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		script.onload = () => initGoogle(cid, onCredential);
		document.head.appendChild(script);
	}, [clientId, onCredential]);

	const signIn = useCallback(() => {
		window.google?.accounts.id.prompt();
	}, []);

	return { isAvailable, signIn };
}

function initGoogle(clientId: string, onCredential: (token: string) => void) {
	window.google?.accounts.id.initialize({
		client_id: clientId,
		callback: (res) => onCredential(res.credential),
		auto_select: false,
	});
}
