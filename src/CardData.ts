import type { CharacterID } from "./common/characters";

export interface CardData {
	readonly id: string;
	readonly name: string;
	readonly index: number;
	readonly character: CharacterID;
	readonly cardNumber: number;
	readonly imgSrc: string;
	/** Treats X as 1 */
	readonly level: number;
}
