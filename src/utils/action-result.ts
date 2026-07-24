export type ActionResult<T> = { data: T; success: true } | { data: string; success: false };

export function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : "An unexpected error occurred.";
}

export function getHttpStatus(error: unknown) {
	if (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		typeof error.response === "object" &&
		error.response !== null &&
		"status" in error.response
	) {
		return error.response.status;
	}
	return undefined;
}
