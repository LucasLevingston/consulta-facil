export type FileUploaderProps = {
	files: File[] | undefined;
	onChange: (files: File[]) => void;
	imageProfile?: boolean;
	currentFile?: string;
};
