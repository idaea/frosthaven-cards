export function isIterable(obj: unknown): obj is Iterable<unknown> {
	// checks for null and undefined
	if (obj == null) {
		return false;
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return typeof (obj as any)[Symbol.iterator] === "function";
}
