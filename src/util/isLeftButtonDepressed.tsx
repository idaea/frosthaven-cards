export function isLeftButtonDepressed(buttons: number): boolean {
	return Boolean(buttons & 1);
}
