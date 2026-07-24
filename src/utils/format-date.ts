const UTC_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
	day: "2-digit",
	hour: "2-digit",
	hour12: false,
	minute: "2-digit",
	month: "short",
	second: "2-digit",
	timeZone: "UTC",
	year: "numeric",
});

const UTC_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
	day: "2-digit",
	month: "short",
	timeZone: "UTC",
	year: "numeric",
});

function toValidDate(value: Date | number | string): Date | null {
	const normalized = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
	const date = normalized instanceof Date ? normalized : new Date(normalized);
	return Number.isNaN(date.getTime()) ? null : date;
}

export function formatUtcDateTime(value: Date | number | string | null | undefined) {
	if (value === null || value === undefined || value === "") return "—";
	const date = toValidDate(value);
	return date ? `${UTC_DATE_TIME_FORMATTER.format(date)} UTC` : "—";
}

export function formatUtcDate(value: Date | number | string | null | undefined) {
	if (value === null || value === undefined || value === "") return "—";
	const date = toValidDate(value);
	return date ? `${UTC_DATE_FORMATTER.format(date)} UTC` : "—";
}
