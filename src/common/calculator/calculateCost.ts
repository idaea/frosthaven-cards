import invariant from "tiny-invariant";

import type { Plus1Target } from "../plus-1-targets";
import { isSummonPlus1Target } from "../plus-1-targets";
import type { StickerTypeID } from "../enhancementStickerTypes";
import { isElement } from "../enhancementStickerTypes";

import { PricingStrategies } from "./PricingStrategies";
import type { PricingStrategyType } from "./PricingStrategies";

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

	/*
		1: "If the ability targets multiple figures or tiles, double the cost. This
		   applies to abilities that summon or affect multiple allies or tokens and to
		   abilities that can target multiple figures or tiles. This does not apply to
		   target, area-of-effect hex, or element enhancements."
	*/
	if (hasMultipleTargets && shouldDoubleDueToMultipleTargets()) {
		cost *= 2;
	}

	// 2: "If the action has a lost icon, but no persistent icon, halve the cost"
	if (isLoss && !isPersistent) {
		cost /= 2;
	}

	/*
		3: "If the ability provides a persistent bonus, whether or not the action has a lost
		   icon, triple the cost. This does not apply to summon stat enhancements."
	*/
	if (
		isPersistent &&
		!(
			stickerType === "plus1" &&
			!!plus1Target &&
			isSummonPlus1Target(plus1Target)
		)
	) {
		cost *= 3;
	}

	// 4: "For each level of the ability card above level 1, add 25 gold to the cost"
	cost += pricingStrategy.getCostFromCardLevel(
		levelOfAbilityCard,
		enhancerLevel
	);

	// 5: "For each enhancement already on the action, add 75 gold to the cost"
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
