import type {
	EnhancementStickerType,
	StickerTypeID} from "../common/enhancementStickerTypes";
import {
	elements,
	negativeConditions,
	positiveConditions,
	enhancementStickerTypeLookup
} from "../common/enhancementStickerTypes";

import type { DotViewModel } from "./viewModelDatabase";

export function getValidStickersForDot(
	dot: DotViewModel
): EnhancementStickerType[] {
	return ((): StickerTypeID[] => {
		const { dotShape, plus1Target } = dot;

		switch (dotShape) {
			case "hex":
				return ["hex"];
			case "square":
				return [
					...onlyIf(plus1Target !== undefined, "plus1"),
					...onlyIf(plus1Target === "move", "jump"),
				];
			case "circle":
				return [
					...onlyIf(plus1Target !== undefined, "plus1"),
					...onlyIf(plus1Target === "move", "jump"),
					...elements,
					"anyElement",
				];
			case "diamond":
				return [
					...onlyIf(plus1Target !== undefined, "plus1"),
					...onlyIf(plus1Target === "move", "jump"),
					...elements,
					"anyElement",
					...negativeConditions,
				];
			case "diamond-plus":
				return [
					...onlyIf(plus1Target !== undefined, "plus1"),
					...onlyIf(plus1Target === "move", "jump"),
					...elements,
					"anyElement",
					...positiveConditions,
				];
		}
	})().map((typeId) => enhancementStickerTypeLookup[typeId]);
}

function onlyIf(
	condition: boolean,
	...stickers: StickerTypeID[]
): StickerTypeID[] {
	return condition ? stickers : [];
}
