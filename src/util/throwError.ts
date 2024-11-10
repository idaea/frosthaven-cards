export function throwError(createError: () => Error): never {
	throw createError();
}
