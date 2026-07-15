export const isAlignUsername = (username?: string | null): boolean => {
	return username?.includes("_JT_") ?? false;
};

export const getStatusManagementDeniedMessage = (): string => {
	return "Only users with '_JT_' in the username can manage status.";
};
