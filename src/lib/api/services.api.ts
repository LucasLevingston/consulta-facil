export { professionalServicesApi } from "./professional-services.api";
export { professionalSettingsApi } from "./professional-settings.api";

import { professionalServicesApi } from "./professional-services.api";
import { professionalSettingsApi } from "./professional-settings.api";

export const servicesApi = {
	...professionalServicesApi,
	...professionalSettingsApi,
};
