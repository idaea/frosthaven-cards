export function* filterIter<T>(
	source: IterableIterator<T>,
	fPred: (x: T) => boolean
): IterableIterator<T> {
	for (const item of source) {
		if (fPred(item)) {
			yield item;
		}
	}
}
