import { Coords } from "./Coords";
import { Region } from "./Region";

export function coordsAdd([ax, ay]: Coords, [bx, by]: Coords): Coords {
	return [ax + bx, ay + by];
}

export function coordsSubtract([ax, ay]: Coords, [bx, by]: Coords): Coords {
	return [ax - bx, ay - by];
}

export function coordsScale([x, y]: Coords, scale: number): Coords {
	return [x * scale, y * scale];
}

export function coordsAreInRegion([x, y]: Coords, region: Region): boolean {
	return (
		x > region.left && x < region.right && y > region.top && y < region.bottom
	);
}
