export function* expandIter<T>(seed: T, getNext: (item: T) => T): Iterable<T> {
	for (let item = seed; ; item = getNext(item)) {
		yield item;
	}
}
