export interface CustomPaginationProps {
	/** Current page, 0-indexed */
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
	/** Show "Página X de Y" label. Default: true */
	showInfo?: boolean;
}
