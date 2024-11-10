export function* repeat<TItem>(
	items: Iterable<TItem>,
	count: number
): Iterable<TItem> {
	for (let i = 0; i < count; i++) {
		for (const item of items) {
			yield item;
		}
	}
}
