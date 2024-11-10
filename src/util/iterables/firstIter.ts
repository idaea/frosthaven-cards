export function firstIter<T>(source: Iterable<T>): T | undefined {
	for (const item of source) {
		return item;
	}

	return undefined;
}
