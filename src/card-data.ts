import { data as rawCardData } from "character-data";
import type { CardFromData } from "character-data";

import type { CardData } from "./CardData";
import { mapBy } from "./util/keyBy";
import { type Plus1Target, canAffectMultiple } from "./common/plus-1-targets";
import { parseLongCharacterID } from "./common/characters";
import { throwError } from "./util/throwError";
import invariant from "tiny-invariant";

export interface CardDatabase {
	// this type is pretty denormalised
	readonly firstId: string;
	readonly lastId: string;
	readonly cards: ReadonlyArray<CardData>;
	readonly lookup: ReadonlyMap<string, CardData>;
}

function createCardDatabase(
	cardDefinitions: Array<CardFromData>
): CardDatabase {
	const cards = cardDefinitions.map((card, i): CardData => {
		return {
			...card,
			index: i,
			character:
				parseLongCharacterID(card.character) ??
				throwError(() => new Error("Invalid character ID")),
			level: card.level === "X" ? 1 : parseInt(card.level),
		};
	});

	return {
		firstId: cards[0].id,
		lastId: cards[cards.length - 1].id,
		cards,
		lookup: mapBy(cards, (x) => x.id),
	};
}

export const cardDatabase: CardDatabase = createCardDatabase(rawCardData);

export interface CardAnnotations {
	readonly top: CardAction;
	readonly bottom: CardAction;
}

/** Maps from card ID to annotations */
export type CardAnnotationsLookup = Record<string, CardAnnotations>;

export interface CardAction {
	readonly dots: Dot[];
	readonly isLoss: boolean;
	readonly hasPersistentIcon: boolean;
}

interface EnhanceableDetails {
	readonly dotShape: DotShape;
	readonly baseNumHexes: number | undefined;
	readonly isPersistent: boolean;
	readonly plus1Target: Plus1Target;
	readonly affectsMultiple: boolean;
}

export interface Dot {
	readonly id: string;
	readonly coords: [number, number];
	readonly enhanceableDetails: EnhanceableDetails;
}

export type DotShape = "square" | "circle" | "diamond" | "diamond-plus" | "hex";

export const emptyCardAnnotations: CardAnnotations = {
	top: {
		dots: [],
		isLoss: false,
		hasPersistentIcon: false,
	},
	bottom: {
		dots: [],
		isLoss: false,
		hasPersistentIcon: false,
	},
};

export function validateCardAnnotations(
	cardAnnotations: CardAnnotations
): void {
	validateCardHalf(cardAnnotations.top);
	validateCardHalf(cardAnnotations.bottom);
}

function validateCardHalf(action: CardAction): void {
	invariant(typeof action.isLoss === "boolean", "isLoss must be boolean");
	invariant(
		typeof action.hasPersistentIcon === "boolean",
		"hasPersistentIcon must be boolean"
	);
	action.dots.every(validateDot);
}

function validateDot(dot: Dot): void {
	invariant(Array.isArray(dot.coords), "coords must be array");

	invariant(
		dot.coords.length === 2 && dot.coords.every((c) => typeof c === "number"),
		"coords must be numbers"
	);

	invariant(typeof dot.id === "string", "Dot ID must be a string");

	validateEnhanceable(dot.enhanceableDetails);
}

function validateEnhanceable({
	dotShape,
	baseNumHexes,
	isPersistent,
	plus1Target,
	affectsMultiple,
}: EnhanceableDetails): void {
	invariant(typeof isPersistent === "boolean", "isPersistent must be boolean");

	if (dotShape === "hex") {
		invariant(plus1Target === undefined, "no targets for hex enhanceable");
		invariant(affectsMultiple, "hex enhanceable must have affectsMultiple");
		invariant(
			typeof baseNumHexes === "number",
			"hex enhanceable must have baseNumHexes"
		);
	} else {
		invariant(
			baseNumHexes === undefined,
			"non-hex enhanceables cannot have baseNumHexes"
		);
	}

	invariant(canAffectMultiple(plus1Target) || !affectsMultiple);
}
