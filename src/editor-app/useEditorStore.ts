import { immer } from "zustand/middleware/immer";
import type { PartialDeep } from "type-fest";
import { create as createStore } from "zustand";
import { original } from "immer";
import { createSelector } from "reselect";
import { createJSONStorage, persist } from "zustand/middleware";
import { customAlphabet } from "nanoid";

import type { CardAnnotations, CardAnnotationsLookup, Dot } from "../card-data";
import { cardDatabase, emptyCardAnnotations } from "../card-data";
import type { CardData } from "../CardData";
import {
	clampCoordsToCardHalf,
	convertCoordsToCardHalf,
} from "../common/card-dimensions";
import { bundledCardAnnotations } from "../bundledCardAnnotations";
import type { Coords } from "../common/geometry/Coords";
import { merge } from "lodash-es";

const nanoid = customAlphabet(
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
	5
);

export interface State {
	dots: {
		selectedDot:
			| undefined
			| {
					cardId: string;
					dotId: string;
			  };

		placeDot: (protoDot: { cardId: string; coords: Coords }) => void;

		selectDot: (protoDot: { cardId: string; dotId: string }) => void;
		editSelectedDot: (dotDelta: PartialDeep<Dot>) => void;
		deleteSelectedDot: () => void;
		clearSelectedDot: () => void;
	};

	setCardAnnotations: (
		cardId: string,
		newDetails: PartialDeep<CardAnnotations>
	) => void;
	cardAnnotationsLookup: CardAnnotationsLookup;
}

export const selectCardAnnotations = createSelector(
	[
		(state: State) => state.cardAnnotationsLookup,
		(_state: State, cardId: string) => cardId,
	],
	(cardAnnotationsLookup, cardId) =>
		cardAnnotationsLookup[cardId] ?? emptyCardAnnotations
);

// is a selector for historical reasons, doesn't currently use the State object
export const selectNearbyCards = createSelector(
	[(_state: State, currentCard: CardData) => currentCard],
	(
		currentCard
	): {
		readonly nextCard: CardData | undefined;
		readonly previousCard: CardData | undefined;
	} => {
		const undefinedIfOutsideBounds = (x: number): number | undefined => {
			if (x < 0) {
				return undefined;
			}
			if (x >= cardDatabase.cards.length) {
				return undefined;
			}
			return x;
		};

		const c = (cIndex: number | undefined) =>
			cIndex === undefined ? undefined : cardDatabase.cards[cIndex];

		return {
			nextCard: c(undefinedIfOutsideBounds(currentCard.index + 1)),
			previousCard: c(undefinedIfOutsideBounds(currentCard.index - 1)),
		};
	}
);

export const selectSelectedDot = createSelector(
	[
		(state: State) => state.dots.selectedDot,
		(state: State) => state.cardAnnotationsLookup,
	],
	(
		editingDot,
		cardAnnotations
	):
		| undefined
		| {
				readonly cardId: string;
				readonly dot: Dot;
		  } => {
		if (!editingDot) {
			return undefined;
		}

		const { cardId, dotId } = editingDot;

		const allDots = [
			...cardAnnotations[editingDot.cardId].top.dots,
			...cardAnnotations[editingDot.cardId].bottom.dots,
		];

		const dot = allDots.find((x) => x.id === dotId);

		if (!dot) {
			return undefined;
		}

		return {
			cardId,
			dot,
		};
	}
);

export const useEditorStore = createStore<State>()(
	persist(
		immer((set) => ({
			dots: {
				selectedDot: undefined,

				placeDot: ({ cardId, coords }) => {
					set((state) => {
						const cardHalfName = convertCoordsToCardHalf(coords);
						const dotId = nanoid();

						if (!state.cardAnnotationsLookup[cardId]) {
							state.cardAnnotationsLookup[cardId] = {
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
						}

						state.cardAnnotationsLookup[cardId][cardHalfName].dots.push({
							id: dotId,
							coords,
							enhanceableDetails: {
								dotShape: "square",
								plus1Target: "attack",
								affectsMultiple: false,
								baseNumHexes: undefined,
								isPersistent: false,
							},
						});
						state.dots.selectedDot = {
							cardId,
							dotId,
						};
					});
				},
				selectDot: ({ cardId, dotId }) => {
					set((state) => {
						state.dots.selectedDot = {
							cardId,
							dotId,
						};
					});
				},
				editSelectedDot: (dotDelta) => {
					set((state) => {
						const selectedDot = original(state.dots.selectedDot);
						if (!selectedDot) {
							return;
						}

						const { cardId, dotId } = selectedDot;

						for (const cardHalfName of ["top", "bottom"] as const) {
							const dots =
								state.cardAnnotationsLookup[cardId][cardHalfName].dots;

							const dot = dots.find((x) => x.id === dotId);

							if (dot) {
								merge(dot, dotDelta);
								dot.coords = clampCoordsToCardHalf(
									dot.coords,
									cardHalfName
								);
								return;
							}
						}
					});
				},
				deleteSelectedDot: () => {
					set((state) => {
						if (!state.dots.selectedDot) {
							return;
						}

						const { cardId, dotId } = state.dots.selectedDot;

						for (const cardHalfName of ["top", "bottom"] as const) {
							const dots =
								state.cardAnnotationsLookup[cardId][cardHalfName].dots;
							const index = dots.findIndex((x) => x.id === dotId);
							if (index !== -1) {
								dots.splice(index, 1);
								break;
							}
						}
					});
				},
				clearSelectedDot: () => {
					set((state) => {
						state.dots.selectedDot = undefined;
					});
				},
			},

			cardAnnotationsLookup: fillGaps(bundledCardAnnotations),

			setCardAnnotations: (cardId, newDetails) => {
				set((state) => {
					const existing = state.cardAnnotationsLookup[cardId] ?? {
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
					state.cardAnnotationsLookup[cardId] = existing;

					if (newDetails.top?.isLoss !== undefined) {
						existing.top.isLoss = newDetails.top?.isLoss;
					}
					if (newDetails.top?.hasPersistentIcon !== undefined) {
						existing.top.hasPersistentIcon =
							newDetails.top?.hasPersistentIcon;
					}
					if (newDetails.bottom?.isLoss !== undefined) {
						existing.bottom.isLoss = newDetails.bottom?.isLoss;
					}
					if (newDetails.bottom?.hasPersistentIcon !== undefined) {
						existing.bottom.hasPersistentIcon =
							newDetails.bottom?.hasPersistentIcon;
					}
				});
			},
		})),
		{
			name: "editor",
			storage: createJSONStorage(() => localStorage),
			merge: (persistedState: unknown, currentState: State): State => ({
				...currentState,
				cardAnnotationsLookup:
					(persistedState as State)?.cardAnnotationsLookup ??
					currentState.cardAnnotationsLookup,
			}),
		}
	)
);

function fillGaps(
	cardAnnotationsLookup: CardAnnotationsLookup
): CardAnnotationsLookup {
	const result = {
		...cardAnnotationsLookup,
	};
	for (const card of cardDatabase.cards) {
		if (result[card.id] === undefined) {
			result[card.id] = emptyCardAnnotations;
		}
	}
	return result;
}

export interface SelectedDot {
	cardId: string;
	details: Dot;
}
