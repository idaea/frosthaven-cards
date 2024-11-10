export function* takeIter<T>(source: Iterable<T>, count: number): Iterable<T> {
	let emitted = 0;
	for (const item of source) {
		if (emitted >= count) {
			return;
		}
		yield item;
		emitted++;
	}
}
