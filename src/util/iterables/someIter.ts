export function someIter<T>(
	iterable: IterableIterator<T>,
	predicate: (x: T) => boolean
): boolean {
	for (const item of iterable) {
		if (predicate(item)) {
			return true;
		}
	}

	return false;
}
