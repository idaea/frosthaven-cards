import type { Plus1Target } from "../plus-1-targets";
import {
	type StickerTypeID,
	isElement,
	type NegativeCondition,
	type PositiveCondition,
} from "../enhancementStickerTypes";

export type PricingStrategyType =
	| "frosthaven"
	| "frosthaven_non_permanent"
	| "gloomhaven_digital";

export type PricingStrategy = {
	getCostFromCardLevel(cardLevel: number, enhancerLevel: number): number;
	getCostFromPriorEnhancements(
		numberOfPriorEnhancements: number,
		enhancerLevel: number
	): number;

	baseNewAttackHexCost: number;
	getPlus1BaseCost(target: Plus1Target): number;
	getOtherStickerBaseCost(sticker: OtherSticker): number;
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
};

const frosthaven_non_permanent: PricingStrategy = {
	...frosthaven,
	getCostFromPriorEnhancements(numberOfPriorEnhancements, enhancerLevel) {
		const vanillaCost = frosthaven.getCostFromPriorEnhancements(
			numberOfPriorEnhancements,
			enhancerLevel
		);

		return Math.max(0, vanillaCost - 20);
	},
};

const gloomhaven_digital: PricingStrategy = {
	getCostFromCardLevel(cardLevel) {
		return (cardLevel - 1) * 10;
	},
	getCostFromPriorEnhancements(numberOfPriorEnhancements, _enhancerLevel) {
		return numberOfPriorEnhancements * 20;
	},
	baseNewAttackHexCost: 150,
	...createStickerBaseCostLookup({
		// values from https://i.imgur.com/nEsIUvG.png
		// recommended by FH dev here: https://www.reddit.com/r/Gloomhaven/comments/uo3som/comment/i8cej68/
		plus1: {
			move: 20,
			attack: 35,
			range: 20,
			target: 40,
			shield: 60,
			retaliate: 40,
			pierce: 15,
			heal: 20,
			push: 20,
			pull: 15,
			teleport: 50,

			"summon-hp": 30,
			"summon-move": 40,
			"summon-attack": 60,
			"summon-range": 40,
		},

		other: {
			regenerate: 40,
			ward: 40,
			strengthen: 100,
			bless: 50,
			wound: 45,
			poison: 30,
			immobilize: 100,
			muddle: 25,
			curse: 100,
			specificElement: 60,
			anyElement: 90,
			jump: 35,
		},
	}),
};

export const PricingStrategies = {
	frosthaven,
	frosthaven_non_permanent,
	gloomhaven_digital,
} satisfies Record<PricingStrategyType, PricingStrategy>;
