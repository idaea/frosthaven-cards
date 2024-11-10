import invariant from "tiny-invariant";

import type { Plus1Target } from "../plus-1-targets";
import { isSummonPlus1Target } from "../plus-1-targets";
import type { StickerTypeID } from "../enhancementStickerTypes";
import { isElement } from "../enhancementStickerTypes";

import {
	PricingStrategies
	
} from "./PricingStrategies";
import type {PricingStrategyType} from "./PricingStrategies";

interface CostFactors {
	stickerType: StickerTypeID;
	plus1Target: Plus1Target | undefined;
	priorHexCount: number;
	isLoss: boolean;
	isPersistent: boolean;
	hasMultipleTargets: boolean;
	levelOfAbilityCard: number;
	numberOfPreviousEnhancements: number;
	pricingStrategyType: PricingStrategyType;
	enhancerLevel: number;
}

export function calculateCost({
	stickerType,
	plus1Target,
	priorHexCount,
	isLoss,
	isPersistent,
	hasMultipleTargets,
	levelOfAbilityCard,
	numberOfPreviousEnhancements,
	pricingStrategyType,
	enhancerLevel,
}: CostFactors) {
	function shouldDoubleDueToMultipleTargets() {
		if (stickerType === "hex") {
			return false;
		}

		if (isElement(stickerType)) {
			return false;
		}

		if (stickerType === "anyElement") {
			return false;
		}

		if (stickerType === "plus1" && plus1Target === "target") {
			return false;
		}

		return true;
	}

	const pricingStrategy = PricingStrategies[pricingStrategyType];

	let cost = 0;

	// look up base cost
	if (stickerType === "plus1") {
		invariant(!!plus1Target);
		cost += pricingStrategy.getPlus1BaseCost(plus1Target);
	} else if (stickerType === "hex") {
		cost += Math.ceil(pricingStrategy.baseNewAttackHexCost / priorHexCount);
	} else {
		cost += pricingStrategy.getOtherStickerBaseCost(stickerType);
	}

	// double BASE COST if multiple targets (does not apply for attack hex)
	if (hasMultipleTargets && shouldDoubleDueToMultipleTargets()) {
		cost *= 2;
	}

	// halve BASE COST if lost
	if (isLoss) {
		cost /= 2;
	}

	// triple BASE COST if persistent bonus
	if (
		isPersistent &&
		stickerType !== "plus1" &&
		!!plus1Target &&
		isSummonPlus1Target(plus1Target)
	) {
		cost *= 3;
	}

	// extra cost for level of ability card
	cost += pricingStrategy.getCostFromCardLevel(
		levelOfAbilityCard,
		enhancerLevel
	);

	// extra cost for previous enhancements to the same action
	cost += pricingStrategy.getCostFromPriorEnhancements(
		numberOfPreviousEnhancements,
		enhancerLevel
	);

	if (enhancerLevel >= 2) {
		cost -= 10;
	}

	if (pricingStrategyType === "frosthaven_non_permanent") {
		cost = Math.ceil(cost * 0.8);
	}

	return cost;
}
