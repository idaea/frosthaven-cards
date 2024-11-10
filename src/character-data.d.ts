declare module "character-data" {
	interface CardFromData {
		id: string;
		cardNumber: number;
		character: string;
		level: string;
		imgSrc: string;
		name: string;
	}

	export const data: Array<CardFromData>;
}
