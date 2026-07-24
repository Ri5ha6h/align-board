export function getInitialColumnVisibility(
	columns: Array<{ accessorKey?: unknown; id?: string }>,
	defaultVisibleColumnIds?: string[],
) {
	if (!defaultVisibleColumnIds?.length) return {};
	const visible = new Set(defaultVisibleColumnIds);
	return Object.fromEntries(
		columns
			.map((column) =>
				column.id || typeof column.accessorKey !== "string"
					? column.id
					: column.accessorKey,
			)
			.filter((id): id is string => Boolean(id))
			.map((id) => [id, visible.has(id)]),
	);
}
