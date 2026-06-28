export { professionalSettingsApi } from "./professionals/professional-settings.api";
export { professionalServicesApi } from "./services/professional-services.api";

import { professionalSettingsApi } from "./professionals/professional-settings.api";
import { professionalServicesApi } from "./services/professional-services.api";

export const servicesApi = {
	...professionalServicesApi,
	...professionalSettingsApi,
};
