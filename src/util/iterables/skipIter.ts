export function* skipIter<T>(source: Iterable<T>, count: number): Iterable<T> {
	let skipped = 0;
	for (const item of source) {
		if (skipped < count) {
			skipped++;
			continue;
		}

		yield item;
	}
}
