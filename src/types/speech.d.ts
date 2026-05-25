interface SpeechRecognitionEvent extends Event {
	results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
	readonly length: number;
	item(index: number): SpeechRecognitionResult;
	[index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
	readonly length: number;
	item(index: number): SpeechRecognitionAlternative;
	[index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
	readonly transcript: string;
	readonly confidence: number;
}

interface SpeechRecognition extends EventTarget {
	lang: string;
	interimResults: boolean;
	maxAlternatives: number;
	onresult: ((event: SpeechRecognitionEvent) => void) | null;
	onerror: ((event: { error: string }) => void) | null;
	onend: (() => void) | null;
	start(): void;
	stop(): void;
}

declare var SpeechRecognition: { new (): SpeechRecognition };

interface Window {
	SpeechRecognition: typeof SpeechRecognition;
	webkitSpeechRecognition: typeof SpeechRecognition;
}
