import { immer } from "zustand/middleware/immer";
import { create as createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createSelector } from "reselect";

import type { Character, CharacterID } from "../common/characters";
import type { StickerTypeID } from "../common/enhancementStickerTypes";
import { calculateCost } from "../common/calculator/calculateCost";

import type { DotViewModel } from "./viewModelDatabase";
import { EnhancementPermanence } from "../common/calculator/PricingStrategies";

type EnhancerLevel = 1 | 2 | 3 | 4;
export interface State {
	unlockedCharacters: Partial<Record<CharacterID, boolean>>;
	unlockCharacter: (character: Character) => void;

	enhancerLevel: EnhancerLevel;
	setEnhancerLevel: (newValue: EnhancerLevel) => void;
	enhancementPermanence: EnhancementPermanence;
	setEnhancementPermanence: (newValue: EnhancementPermanence) => void;

	dotIDToSticker: Record<string, StickerTypeID>;
	addSticker: (dotID: string, stickerTypeID: StickerTypeID) => void;
	removeSticker: (dotID: string) => void;
}

export const useMainAppStore = createStore<State>()(
	persist(
		immer((set) => ({
			unlockedCharacters: {},
			unlockCharacter: (character) => {
				set((state) => {
					state.unlockedCharacters[character.id] = true;
				});
			},

			enhancerLevel: 1,
			setEnhancerLevel: (newValue) => {
				set((state) => {
					state.enhancerLevel = newValue;
				});
			},

			enhancementPermanence: "permanent",
			setEnhancementPermanence: (newValue) => {
				set((state) => {
					state.enhancementPermanence = newValue;
				});
			},

			dotIDToSticker: {},
			addSticker: (dotID, stickerTypeID) => {
				set((state) => {
					state.dotIDToSticker[dotID] = stickerTypeID;
				});
			},
			removeSticker: (dotID) => {
				set((state) => {
					delete state.dotIDToSticker[dotID];
				});
			},
		})),
		{
			name: "card-choices",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

const selectNumberOfStickersOnRelatedDots = createSelector(
	[
		(state: State) => state.dotIDToSticker,
		(_state: State, dot: DotViewModel) => dot,
	],
	(dotIDToSticker, dot): number => {
		const thisDotHasSticker = dotIDToSticker[dot.id];

		console.log(dot.id, dot.otherDotsOnSameAction);

		if (!thisDotHasSticker) {
			return dot.otherDotsOnSameAction.filter(
				(dotID) => dotIDToSticker[dotID]
			).length;
		} else {
			return dot.otherDotsOnSameAction.filter(
				(dotID) => dotID < dot.id && dotIDToSticker[dotID] !== undefined
			).length;
		}
	}
);

export const selectCostCalculator = createSelector(
	[
		(state: State) => state.enhancementPermanence,
		(state: State) => state.enhancerLevel,
		(state: State, dot: DotViewModel) =>
			selectNumberOfStickersOnRelatedDots(state, dot),
		(_state: State, dot: DotViewModel) => dot,
	],
	(
		enhancementPermanence,
		enhancerLevel,
		numberOfStickersOnSameAction,
		dot
	) => {
		return (sticker: StickerTypeID) =>
			calculateCost(
				{
					enhancerLevel: enhancerLevel,
					hasMultipleTargets: dot.affectsMultiple,
					isLoss: dot.isOnLossAction,
					isPersistent: dot.isOnPersistentAction,
					levelOfAbilityCard: dot.cardLevel,
					plus1Target: dot.plus1Target,
					numberOfPreviousEnhancements: numberOfStickersOnSameAction,
					priorHexCount: dot.baseNumHexes ?? 0,
					stickerType: sticker,
				},
				enhancementPermanence
			);
	}
);
