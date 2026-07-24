export function findDetailValue(value: unknown, candidateKeys: string[]): unknown {
	const candidates = new Set(
		candidateKeys.map((key) => key.toLowerCase().replaceAll(/[^a-z0-9]/g, "")),
	);
	const queue: unknown[] = [value];
	const visited = new Set<object>();

	while (queue.length) {
		const current = queue.shift();
		if (!current || typeof current !== "object" || visited.has(current)) continue;
		visited.add(current);
		for (const [key, nestedValue] of Object.entries(current)) {
			const normalizedKey = key.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
			if (candidates.has(normalizedKey)) return nestedValue;
			if (nestedValue && typeof nestedValue === "object") queue.push(nestedValue);
		}
	}
	return undefined;
}
