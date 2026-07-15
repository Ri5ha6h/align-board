const replaceJustTransformReferences = (value: string) => {
	return value
		.replace(/jus(?:t[\s_-]*)?transform/gi, "Alignbits")
		.replace(/(^|[^A-Za-z0-9])JT(?=$|[\s_:/.-]|[A-Z])/g, "$1AB")
		.replace(/(^|[^A-Za-z0-9])Jt(?=$|[\s_:/.-]|[A-Z])/g, "$1Ab")
		.replace(/(^|[^A-Za-z0-9])jt(?=$|[\s_:/.-]|[A-Z])/g, "$1ab");
};

export const sanitizeHistoryDataForDisplay = <T>(value: T): T => {
	if (typeof value === "string") {
		return replaceJustTransformReferences(value) as T;
	}

	if (Array.isArray(value)) {
		return value.map((item) => sanitizeHistoryDataForDisplay(item)) as T;
	}

	if (value !== null && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, nestedValue]) => [
				replaceJustTransformReferences(key),
				sanitizeHistoryDataForDisplay(nestedValue),
			]),
		) as T;
	}

	return value;
};
