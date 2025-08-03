import bannerspearIcon from "../frosthaven-data/icons/characters/fh-banner-spear-bw-icon.png";
import blinkbladeIcon from "../frosthaven-data/icons/characters/fh-blinkblade-bw-icon.png";
import boneshaperIcon from "../frosthaven-data/icons/characters/fh-boneshaper-bw-icon.png";
import crashingTideIcon from "../frosthaven-data/icons/characters/fh-crashing-tide-bw-icon.png";
import deathwalkerIcon from "../frosthaven-data/icons/characters/fh-deathwalker-bw-icon.png";
import deepwraithIcon from "../frosthaven-data/icons/characters/fh-deepwraith-bw-icon.png";
import drifterIcon from "../frosthaven-data/icons/characters/fh-drifter-bw-icon.png";
import frozenFistIcon from "../frosthaven-data/icons/characters/fh-frozen-fist-bw-icon.png";
import geminateIcon from "../frosthaven-data/icons/characters/fh-geminate-bw-icon.png";
import hiveIcon from "../frosthaven-data/icons/characters/fh-hive-bw-icon.png";
import infuserIcon from "../frosthaven-data/icons/characters/fh-infuser-bw-icon.png";
import metalMosaicIcon from "../frosthaven-data/icons/characters/fh-metal-mosaic-bw-icon.png";
import painConduitIcon from "../frosthaven-data/icons/characters/fh-pain-conduit-bw-icon.png";
import pyroclastIcon from "../frosthaven-data/icons/characters/fh-pyroclast-bw-icon.png";
import shattersongIcon from "../frosthaven-data/icons/characters/fh-shattersong-bw-icon.png";
import snowdancerIcon from "../frosthaven-data/icons/characters/fh-snowdancer-bw-icon.png";
import trapperIcon from "../frosthaven-data/icons/characters/fh-trapper-bw-icon.png";
import invariant from "tiny-invariant";

export type CharacterID = (typeof rawCharacters)[number]["id"];
export type CharacterShortID = (typeof rawCharacters)[number]["shortId"];

export interface Character {
	readonly id: CharacterID;
	readonly shortId: CharacterShortID;
	readonly codename?: string;
	readonly colour: string;
	readonly iconSrc: string;
	readonly isAlwaysUnlocked?: boolean;
}

const rawCharacters = [
	{
		id: "drifter",
		shortId: "DF",
		colour: "#8C7566",
		iconSrc: drifterIcon,
		isAlwaysUnlocked: true,
	},
	{
		id: "blinkblade",
		shortId: "BB",
		colour: "#3E7D9B",
		iconSrc: blinkbladeIcon,
		isAlwaysUnlocked: true,
	},
	{
		id: "banner spear",
		shortId: "BN",
		colour: "#B29243",
		iconSrc: bannerspearIcon,
		isAlwaysUnlocked: true,
	},
	{
		id: "deathwalker",
		shortId: "DW",
		colour: "#747A8B",
		iconSrc: deathwalkerIcon,
		isAlwaysUnlocked: true,
	},
	{
		id: "boneshaper",
		shortId: "BO",
		colour: "#347132",
		iconSrc: boneshaperIcon,
		isAlwaysUnlocked: true,
	},
	{
		id: "geminate",
		shortId: "GE",
		colour: "#94274E",
		iconSrc: geminateIcon,
		isAlwaysUnlocked: true,
	},

	{
		id: "infuser",
		shortId: "IF",
		codename: "Astral",
		colour: "#6B9E47",
		iconSrc: infuserIcon,
	},
	{
		id: "pyroclast",
		shortId: "PY",
		codename: "Meteor",
		colour: "#BE462F",
		iconSrc: pyroclastIcon,
	},
	{
		id: "shattersong",
		shortId: "SH",
		codename: "Shards",
		colour: "#807681",
		iconSrc: shattersongIcon,
	},
	{
		id: "trapper",
		shortId: "TA",
		codename: "Trap",
		colour: "#714A2E",
		iconSrc: trapperIcon,
	},
	{
		id: "pain conduit",
		shortId: "PC",
		codename: "Shackles",
		colour: "#4D5186",
		iconSrc: painConduitIcon,
	},
	{
		id: "snowdancer",
		shortId: "SD",
		codename: "Snowflake",
		colour: "#5995A2",
		iconSrc: snowdancerIcon,
	},
	{
		id: "frozen fist",
		shortId: "FF",
		codename: "Fist",
		colour: "#6790AE",
		iconSrc: frozenFistIcon,
	},
	{
		id: "hive",
		shortId: "HV",
		codename: "Prism",
		colour: "#BC9847",
		iconSrc: hiveIcon,
	},
	{
		id: "metal mosaic",
		shortId: "ME",
		codename: "Drill",
		colour: "#A38B69",
		iconSrc: metalMosaicIcon,
	},
	{
		id: "deepwraith",
		shortId: "DT",
		codename: "Kelp",
		colour: "#624278",
		iconSrc: deepwraithIcon,
	},
	{
		id: "crashing tide",
		shortId: "CR",
		codename: "Coral",
		colour: "#814B6B",
		iconSrc: crashingTideIcon,
	},
] as const;

export const characters = rawCharacters as ReadonlyArray<Character>;

const longIdToCharacter = new Map(characters.map((c) => [c.id, c]));
const shortIdToCharacter = new Map(characters.map((c) => [c.shortId, c]));

export function getCharacterByID(id: CharacterID): Character {
	const character = longIdToCharacter.get(id);

	invariant(!!character);

	return character;
}

export function getCharacterByShortID(id: CharacterShortID): Character {
	const character = shortIdToCharacter.get(id);

	invariant(!!character);

	return character;
}

export function parseShortCharacterID(
	str: string | undefined
): CharacterShortID | undefined {
	if (str === undefined) {
		return undefined;
	}

	if (shortIdToCharacter.has(str as CharacterShortID)) {
		return str as CharacterShortID;
	}

	return undefined;
}

export function parseLongCharacterID(
	str: string | undefined
): CharacterID | undefined {
	if (str === undefined) {
		return undefined;
	}

	if (longIdToCharacter.has(str as CharacterID)) {
		return str as CharacterID;
	}

	return undefined;
}
