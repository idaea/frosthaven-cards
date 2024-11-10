export function keyBy<TKey extends string, TValue>(
	items: Array<TValue> | ReadonlyArray<TValue>,
	selectKey: (item: TValue) => TKey
): Record<TKey, TValue> {
	return Object.fromEntries(
		items.map((x) => [selectKey(x), x] as [TKey, TValue])
	) as Record<TKey, TValue>;
}

export function mapBy<TKey extends string, TValue>(
	items: TValue[],
	selectKey: (item: TValue) => TKey
): ReadonlyMap<TKey, TValue> {
	return new Map<TKey, TValue>(
		items.map((x) => [selectKey(x), x] as [TKey, TValue])
	);
}
