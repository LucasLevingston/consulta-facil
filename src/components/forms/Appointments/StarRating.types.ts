export interface StarRatingProps {
	active: number;
	onStarClick: (star: number) => void;
	onStarHover: (star: number) => void;
	onMouseLeave: () => void;
}
