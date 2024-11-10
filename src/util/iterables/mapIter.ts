export function* mapIter<TFrom, TTo>(
	source: Iterable<TFrom>,
	fMap: (x: TFrom) => TTo
): IterableIterator<TTo> {
	for (const item of source) {
		yield fMap(item);
	}
}
