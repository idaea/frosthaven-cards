import type { Plus1Target } from "../plus-1-targets";
import {
	type StickerTypeID,
	isElement,
	type NegativeCondition,
	type PositiveCondition,
} from "../enhancementStickerTypes";

export type PricingStrategy = {
	getCostFromCardLevel(cardLevel: number, enhancerLevel: number): number;
	getCostFromPriorEnhancements(
		numberOfPriorEnhancements: number,
		enhancerLevel: number
	): number;

	baseNewAttackHexCost: number;
	getPlus1BaseCost(target: Plus1Target): number;
	getOtherStickerBaseCost(sticker: OtherSticker): number;
	applyFinalDiscounts(cost: number, costFactors: CostFactors): number;
};

type OtherSticker = Exclude<StickerTypeID, "plus1" | "hex">;

type BaseCostLookupOpts = {
	plus1: Record<
		Exclude<Plus1Target, "attack-trap" | "heal-trap" | "move-token">,
		number
	>;
	other: Record<
		| PositiveCondition
		| NegativeCondition
		| "jump"
		| "specificElement"
		| "anyElement",
		number
	>;
};

function createStickerBaseCostLookup(
	opts: BaseCostLookupOpts
): Pick<PricingStrategy, "getPlus1BaseCost" | "getOtherStickerBaseCost"> {
	return {
		getPlus1BaseCost(target) {
			if (target === "attack-trap") {
				return opts.plus1.attack;
			}

			if (target === "heal-trap") {
				return opts.plus1.heal;
			}

			if (target === "move-token") {
				return opts.plus1.move;
			}

			return opts.plus1[target];
		},
		getOtherStickerBaseCost(sticker) {
			if (isElement(sticker)) {
				return opts.other.specificElement;
			}

			return opts.other[sticker];
		},
	};
}

const frosthaven: PricingStrategy = {
	getCostFromCardLevel(cardLevel, enhancerLevel) {
		return (cardLevel - 1) * (enhancerLevel >= 3 ? 15 : 25);
	},
	getCostFromPriorEnhancements(numberOfPriorEnhancements, enhancerLevel) {
		return numberOfPriorEnhancements * (75 - (enhancerLevel === 4 ? 25 : 0));
	},
	baseNewAttackHexCost: 200,
	...createStickerBaseCostLookup({
		plus1: {
			move: 30,
			attack: 50,
			range: 30,
			target: 75,
			shield: 80,
			retaliate: 60,
			pierce: 30,
			heal: 30,
			push: 30,
			pull: 20,
			teleport: 50,
			"summon-hp": 40,
			"summon-move": 60,
			"summon-attack": 100,
			"summon-range": 50,
		},

		other: {
			jump: 60,
			regenerate: 40,
			ward: 75,
			strengthen: 100,
			bless: 75,
			wound: 75,
			poison: 50,
			immobilize: 150,
			muddle: 40,
			curse: 150,
			specificElement: 100,
			anyElement: 150,
		},
	}),
	applyFinalDiscounts(cost, { enhancerLevel }) {
		if (enhancerLevel >= 2) {
			return flatDiscount(cost, 10);
		}

		return cost;
	},
};

const frosthaven_non_permanent: PricingStrategy = {
	...frosthaven,
	applyFinalDiscounts(cost, costFactors) {
		// Apply the "Temporary Enhancements" rules from the FH rulebook's "Game Variants" section

		// "First, calculate the normal enhancement cost, including any discounts."
		let discountedCost = frosthaven.applyFinalDiscounts(cost, costFactors);

		// "Next, if the action has at least one previous enhancement, reduce the cost by 20 gold."
		if (costFactors.numberOfPreviousEnhancements > 0) {
			discountedCost = flatDiscount(discountedCost, 20);
		}

		// "Finally, reduce the cost by 20 percent (rounded up)."
		discountedCost = proportionalDiscount(discountedCost, 0.8);

		return discountedCost;
	},
};

function flatDiscount(cost: number, discountAmount: number): number {
	return Math.max(0, cost - discountAmount);
}

function proportionalDiscount(cost: number, scale: number): number {
	return Math.ceil(cost * scale);
}

export const PricingStrategies = {
	frosthaven,
	frosthaven_non_permanent,
};

export interface CostFactors {
	stickerType: StickerTypeID;
	plus1Target: Plus1Target | undefined;
	priorHexCount: number;
	isLoss: boolean;
	isPersistent: boolean;
	hasMultipleTargets: boolean;
	levelOfAbilityCard: number;
	numberOfPreviousEnhancements: number;
	enhancerLevel: number;
}

export type EnhancementPermanence = "permanent" | "temporary";
