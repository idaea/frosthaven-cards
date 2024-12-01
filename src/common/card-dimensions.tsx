import type { IterableElement } from "type-fest";

import type { Coords } from "./geometry/Coords";
import { Region } from "./geometry/Region";
import { coordsAreInRegion } from "./geometry/coords-utils";

export const cardHalfNames = ["top", "bottom"] as const;
export type CardHalfName = IterableElement<typeof cardHalfNames>;

/** width / height */
export const cardAspectRatio = 368 / 553;

const cardHeaderRegion: Region = {
	top: 0,
	left: 0,
	right: 1,
	bottom: 0.1,
};

const cardHalfDimensions = {
	top: {
		left: 0,
		right: 1,

		top: 0,
		bottom: 0.5,
	},
	bottom: {
		left: 0,
		right: 1,

		top: 0.5,
		bottom: 1,
	},
};

export function clampCoordsToCardHalf(
	[x, y]: Coords,
	cardHalfName: "top" | "bottom"
): Coords {
	const dimensions = cardHalfDimensions[cardHalfName];

	return [
		Math.max(Math.min(x, dimensions.right), dimensions.left),
		Math.max(Math.min(y, dimensions.bottom), dimensions.top),
	];
}

export function convertCoordsToCardHalf([_, y]: Coords): "top" | "bottom" {
	return y > 0.5 ? "bottom" : "top";
}

export function isInCardHeader(coords: Coords): boolean {
	return coordsAreInRegion(coords, cardHeaderRegion);
}
