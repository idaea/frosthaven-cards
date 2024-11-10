export function* range(from: number, to: number): IterableIterator<number> {
	if (from === to) {
		return;
	}

	const increment = from > to ? -1 : 1;
	for (let i = from; i !== to; i += increment) {
		yield i;
	}
}

export function* countUp(from: number, to: number): IterableIterator<number> {
	for (let i = from; i <= to; i++) {
		yield i;
	}
}

export function* countDown(from: number, to: number): IterableIterator<number> {
	for (let i = from; i >= to; i--) {
		yield i;
	}
}
