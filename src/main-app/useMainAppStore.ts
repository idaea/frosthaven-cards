import { immer } from "zustand/middleware/immer";
import { create as createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createSelector } from "reselect";

import type { Character, CharacterID } from "../common/characters";
import type { StickerTypeID } from "../common/enhancementStickerTypes";
import { calculateCost } from "../common/calculator/calculateCost";

import type { DotViewModel } from "./viewModelDatabase";

type EnhancerLevel = 1 | 2 | 3 | 4;
type EnhancementPermanence = "permanent" | "temporary";

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

export const selectCostCalculator = createSelector(
	[
		(state: State) => state.enhancementPermanence,
		(state: State) => state.enhancerLevel,
	],
	(enhancementPermanence, enhancerLevel) => {
		return (dot: DotViewModel, sticker: StickerTypeID) =>
			calculateCost({
				enhancerLevel: enhancerLevel,
				pricingStrategyType:
					enhancementPermanence === "temporary"
						? "frosthaven_non_permanent"
						: "frosthaven",

				hasMultipleTargets: dot.affectsMultiple,
				isLoss: dot.isOnLossAction,
				isPersistent: dot.isOnPersistentAction,
				levelOfAbilityCard: dot.cardLevel,
				plus1Target: dot.plus1Target,
				numberOfPreviousEnhancements: 0,
				priorHexCount: dot.baseNumHexes ?? 0,
				stickerType: sticker,
			});
	}
);
