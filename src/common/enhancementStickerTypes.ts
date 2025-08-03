import type { IterableElement } from "type-fest";
import hexIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-hex-attack-sticker.png";
import plus1Icon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-plus-one-sticker.png";
import fireIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-fire-sticker.png";
import iceIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-ice-sticker.png";
import airIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-air-sticker.png";
import earthIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-earth-sticker.png";
import lightIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-light-sticker.png";
import darkIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-dark-sticker.png";
import regenerateIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-regenerate-sticker.png";
import wardIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-ward-sticker.png";
import strengthenIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-strengthen-sticker.png";
import blessIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-bless-sticker.png";
import woundIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-wound-sticker.png";
import poisonIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-poison-sticker.png";
import immobilizeIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-immobilize-sticker.png";
import muddleIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-muddle-sticker.png";
import curseIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-curse-sticker.png";
import jumpIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-jump-sticker.png";
import wildElementIcon from "../frosthaven-data/stickers/individual/enhancement-stickers/fh-wild-sticker.png";

import { keyBy } from "../util/keyBy";

export interface EnhancementStickerType {
	id: StickerTypeID;
	iconSrc: string;
}

export const rawEnhancementStickerTypes = [
	{ id: "plus1", iconSrc: plus1Icon },
	{ id: "jump", iconSrc: jumpIcon },

	{ id: "hex", iconSrc: hexIcon },

	{ id: "fire", iconSrc: fireIcon },
	{ id: "ice", iconSrc: iceIcon },
	{ id: "air", iconSrc: airIcon },
	{ id: "earth", iconSrc: earthIcon },
	{ id: "light", iconSrc: lightIcon },
	{ id: "dark", iconSrc: darkIcon },
	{ id: "anyElement", iconSrc: wildElementIcon },

	{ id: "regenerate", iconSrc: regenerateIcon },
	{ id: "ward", iconSrc: wardIcon },
	{ id: "strengthen", iconSrc: strengthenIcon },
	{ id: "bless", iconSrc: blessIcon },

	{ id: "wound", iconSrc: woundIcon },
	{ id: "poison", iconSrc: poisonIcon },
	{ id: "immobilize", iconSrc: immobilizeIcon },
	{ id: "muddle", iconSrc: muddleIcon },
	{ id: "curse", iconSrc: curseIcon },
] as const;
export type StickerTypeID = (typeof rawEnhancementStickerTypes)[number]["id"];

export const enhancementStickerTypes =
	rawEnhancementStickerTypes as ReadonlyArray<EnhancementStickerType>;

export const enhancementStickerTypeLookup = keyBy(
	enhancementStickerTypes,
	(x) => x.id
);

export const positiveConditions = new Set([
	"regenerate",
	"ward",
	"strengthen",
	"bless",
] as const);
export type PositiveCondition = IterableElement<typeof positiveConditions>;

export const negativeConditions = new Set([
	"wound",
	"poison",
	"immobilize",
	"muddle",
	"curse",
] as const);
export type NegativeCondition = IterableElement<typeof negativeConditions>;

export const elements = new Set([
	"fire",
	"ice",
	"air",
	"earth",
	"light",
	"dark",
] as const);
export type Element = IterableElement<typeof elements>;

export function isElement(
	stickerTypeID: StickerTypeID
): stickerTypeID is Element {
	return elements.has(stickerTypeID as Element);
}
