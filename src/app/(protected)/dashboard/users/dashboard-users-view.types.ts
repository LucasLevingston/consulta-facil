export interface UsersPageBodyProps {
	page: number;
	roleFilter: string;
	search: string;
	debouncedSearch: string;
	updateParams: (
		updates: Record<string, string | null>,
		resetPage?: boolean,
	) => void;
}
