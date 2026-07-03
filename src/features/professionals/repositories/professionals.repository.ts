import { professionalsListingRepo } from "./professionals-listing.repository";
import { professionalsProfileRepo } from "./professionals-profile.repository";

export const professionalsRepository = {
	...professionalsListingRepo,
	...professionalsProfileRepo,
};
