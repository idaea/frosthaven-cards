import { data as rawCardData } from "character-data";
import type { CardFromData } from "character-data";

import type { CardData } from "./CardData";
import { mapBy } from "./util/keyBy";
import type {
	Plus1Target,
	MultiAffectingPlus1Target,
} from "./common/plus-1-targets";
import { parseLongCharacterID } from "./common/characters";
import { throwError } from "./util/throwError";

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
	readonly isPersistent: boolean;
}

type EnhanceableDetails =
	| {
			readonly dotShape: "hex";
			readonly baseNumHexes: number;

			readonly plus1Target: undefined;
			readonly affectsMultiple: false;
	  }
	| {
			readonly dotShape: Exclude<DotShape, "hex">;
			readonly plus1Target: undefined | MultiAffectingPlus1Target;
			readonly affectsMultiple: boolean;

			readonly baseNumHexes: undefined;
	  }
	| {
			readonly dotShape: Exclude<DotShape, "hex">;
			readonly plus1Target: Exclude<Plus1Target, MultiAffectingPlus1Target>;
			readonly affectsMultiple: false;

			readonly baseNumHexes: undefined;
	  };

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
		isPersistent: false,
	},
	bottom: {
		dots: [],
		isLoss: false,
		isPersistent: false,
	},
};
