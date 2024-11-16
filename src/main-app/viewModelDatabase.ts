import invariant from "tiny-invariant";

import { bundledCardAnnotations } from "../bundledCardAnnotations";
import type { CardAnnotations, DotShape } from "../card-data";
import { cardDatabase } from "../card-data";
import type { CardData } from "../CardData";
import type { Coords } from "../common/Coords";
import type { Plus1Target } from "../common/plus-1-targets";
import { CardHalfName } from "../common/card-dimensions";

export const viewModelDatabase = deriveViewModelDatabase();

function deriveViewModelDatabase(): ViewModelDatabase {
	const cards = cardDatabase.cards.map((card): CardViewModel => {
		const annotations = bundledCardAnnotations[card.id];

		return {
			...card,
			dots: [
				...(annotations?.top
					? getDotsFromAction(card.id, card.level, annotations, "top")
					: []),
				...(annotations?.bottom
					? getDotsFromAction(card.id, card.level, annotations, "bottom")
					: []),
			],
		};
	});

	const dotIDToDot = new Map<string, DotViewModel>(
		cards.flatMap((card) => card.dots).map((dot) => [dot.id, dot])
	);

	const cardIDToCard = new Map<string, CardViewModel>(
		cards.map((card) => [card.id, card])
	);

	return {
		cards,
		getDot(dotId: string) {
			const dot = dotIDToDot.get(dotId);

			invariant(!!dot);

			return dot;
		},
		getCard(cardId: string) {
			const card = cardIDToCard.get(cardId);

			invariant(!!card);

			return card;
		},
	};
}

function getDotsFromAction(
	cardId: string,
	cardLevel: number,
	cardAnnotations: CardAnnotations,
	cardHalf: CardHalfName
): Array<DotViewModel> {
	const cardAction = cardAnnotations[cardHalf];
	const allDotsOnAction = cardAction.dots.map((x) => x.id);

	return cardAction.dots.map((dot) => ({
		id: dot.id,
		cardId,
		cardLevel,
		cardHalf,
		otherDotsOnSameAction: allDotsOnAction.filter((x) => x !== dot.id),
		isOnLossAction: cardAction.isLoss,
		isOnPersistentAction: cardAction.isPersistent,
		coords: dot.coords,
		dotShape: dot.enhanceableDetails.dotShape,
		baseNumHexes: dot.enhanceableDetails.baseNumHexes,
		plus1Target: dot.enhanceableDetails.plus1Target,
		affectsMultiple: dot.enhanceableDetails.affectsMultiple,
	}));
}

export interface ViewModelDatabase {
	readonly cards: CardViewModel[];
	getDot(dotId: string): DotViewModel;
	getCard(cardId: string): CardViewModel;
}

export interface CardViewModel extends CardData {
	readonly dots: DotViewModel[];
}

export interface DotViewModel {
	readonly id: string;
	readonly cardId: string;
	readonly cardLevel: number;
	readonly cardHalf: CardHalfName;
	readonly otherDotsOnSameAction: string[];
	readonly isOnLossAction: boolean;
	readonly isOnPersistentAction: boolean;
	readonly coords: Coords;
	readonly dotShape: DotShape;
	readonly baseNumHexes: number | undefined;
	readonly plus1Target: Plus1Target | undefined;
	readonly affectsMultiple: boolean;
}
