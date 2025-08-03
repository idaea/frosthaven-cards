import * as fs from "node:fs/promises";
import * as url from "node:url";

import type { Plugin } from "vite";
import { groupBy } from "lodash-es";

interface RawCardEntry {
	name: string;
	points: number;
	expansion: string;
	image: string;
	xws: string;
	level: string;
	initiative: string;
	cardno: string;
	"character-xws": string;
}

export default function rollupPlugin(): Plugin {
	return {
		name: "character-data",
		resolveId(source) {
			if (source === "character-data") {
				// this signals that Rollup should not ask other plugins or check
				// the file system to find this id
				return source;
			}
			return null; // other ids should be handled as usually
		},
		async load(id) {
			if (id !== "character-data") {
				return null; // other ids should be handled as usually
			}

			const characterAbilityCardData = JSON.parse(
				await fs.readFile(
					url.fileURLToPath(
						import.meta.resolve(
							"./src/frosthaven-data/character-ability-cards.json"
						)
					),
					{ encoding: "utf-8" }
				)
			) as RawCardEntry[];

			const dedupedCardData = Object.values(
				groupBy(
					characterAbilityCardData.filter((x) => x.cardno !== "-"),
					(x) => x.cardno
				)
			).flatMap((group) => group.at(-1)!);

			return [
				...dedupedCardData.map(
					(card) =>
						`import card${card.cardno} from "./src/frosthaven-data/character-ability-cards/${card.image}?h=400&format=webp";`
				),
				`export const data = [`,
				dedupedCardData
					.map((x) => ({
						id: x.cardno,
						character:
							x["character-xws"] === "deminate"
								? "geminate"
								: x["character-xws"],
						name: formatName(x.name),
						level: x.level,
						cardNumber: parseInt(x.cardno, 10),
					}))
					.filter((x) => !Number.isNaN(x.cardNumber))
					.sort((a, b) => a.cardNumber - b.cardNumber)
					.map(
						(x) => `{
							id: "${x.id}",
							character: "${x.character}",
							name: "${x.name}",
							imgSrc: card${x.id},
							level: "${x.level}",
							cardNumber: ${x.cardNumber}
						}`
					)
					.join(","),
				`]`,
			].join("\n");
		},
	};
}

const uncapitalizedWords = [
	"a",
	"an",
	"and",
	"as",
	"at",
	"but",
	"by",
	"down",
	"for",
	"from",
	"if",
	"in",
	"into",
	"like",
	"near",
	"nor",
	"of",
	"off ",
	"on",
	"once",
	"onto",
	"or",
	"over",
	"past",
	"so",
	"than",
	"that",
	"the",
	"to",
	"upon",
	"when",
	"with",
	"yet",
];
const regex_word = /\b[\w\d']+\b/g;
const regex_uncapitalizedWords = new RegExp(
	`^(${uncapitalizedWords.join("|")})$`,
	"i"
);

function formatName(name: string): string {
	return name.replaceAll(regex_word, (word, offset) => {
		const isFirst = offset === 0;
		const isLast = offset + word.length === name.length;

		if (regex_uncapitalizedWords.test(word) && !isFirst && !isLast) {
			return word;
		} else {
			return word[0].toUpperCase() + word.substring(1);
		}
	});
}
