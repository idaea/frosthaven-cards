import type { IterableElement } from "type-fest";

export const playerPlus1Targets = new Set([
	"move",
	"move-token",
	"attack",
	"attack-trap",
	"range",
	"target",
	"shield",
	"retaliate",
	"pierce",
	"heal",
	"heal-trap",
	"push",
	"pull",
	"teleport",
] as const);

export const multiAffectingPlus1Target = new Set([
	"move",
	"move-token",
	"attack",
	"attack-trap",
	"range",
	"shield",
	"retaliate",
	"pierce",
	"heal",
	"heal-trap",
	"push",
	"pull",
	"teleport",
	"summon-attack",
	"summon-range",
] as const satisfies Plus1Target[]);

export const summonPlus1Targets = new Set([
	"summon-hp",
	"summon-move",
	"summon-attack",
	"summon-range",
] as const);

export function isSummonPlus1Target(x: Plus1Target): x is SummonPlus1Target {
	return summonPlus1Targets.has(x as SummonPlus1Target);
}

export type PlayerPlus1Target = IterableElement<typeof playerPlus1Targets>;
export type MultiAffectingPlus1Target = IterableElement<
	typeof multiAffectingPlus1Target
>;
export type SummonPlus1Target = IterableElement<typeof summonPlus1Targets>;

export type Plus1Target = PlayerPlus1Target | SummonPlus1Target;

export function canAffectMultiple(
	enhanceable: Plus1Target | undefined
): enhanceable is MultiAffectingPlus1Target {
	if (enhanceable === undefined) {
		return true;
	}

	return multiAffectingPlus1Target.has(
		enhanceable as MultiAffectingPlus1Target
	);
}
