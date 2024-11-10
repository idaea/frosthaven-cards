export function* interleave<TItem, TSeparator>(
	source: Iterable<TItem>,
	separator: TSeparator
): Iterable<TItem | TSeparator> {
	let isFirst = true;

	for (const item of source) {
		if (!isFirst) {
			yield separator;
		}

		yield item;

		isFirst = false;
	}
}
