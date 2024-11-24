import { Coords } from "./Coords";

export function coordsAdd([ax, ay]: Coords, [bx, by]: Coords): Coords {
	return [ax + bx, ay + by];
}

export function coordsSubtract([ax, ay]: Coords, [bx, by]: Coords): Coords {
	return [ax - bx, ay - by];
}

export function coordsScale([x, y]: Coords, scale: number): Coords {
	return [x * scale, y * scale];
}
