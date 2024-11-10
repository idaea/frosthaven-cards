export function getDesaturatedColour(colour: string): string {
	return `hsl(from ${colour} h 30% 85%)`;
}

export function getVeryDesaturatedColour(colour: string): string {
	return `hsl(from ${colour} h 35% 93%)`;
}

export function getDarkColour(colour: string): string {
	return `hsl(from ${colour} h s 30%)`;
}
