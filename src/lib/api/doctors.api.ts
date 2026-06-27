export { professionalApplicationsApi } from "./professionals/professional-applications.api";
export { professionalPortfolioApi } from "./professionals/professional-portfolio.api";
export { professionalProfileApi } from "./professionals/professional-profile.api";
export { professionalsListingApi } from "./professionals/professionals.api";

import { professionalApplicationsApi } from "./professionals/professional-applications.api";
import { professionalPortfolioApi } from "./professionals/professional-portfolio.api";
import { professionalProfileApi } from "./professionals/professional-profile.api";
import { professionalsListingApi } from "./professionals/professionals.api";

export const professionalsApi = {
	...professionalsListingApi,
	...professionalApplicationsApi,
	...professionalProfileApi,
	...professionalPortfolioApi,
};
