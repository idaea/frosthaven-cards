import {
	validateCardAnnotations,
	type CardAnnotationsLookup,
} from "./card-data";
import cardAnnotations from "./data/card-annotations.json";

export const bundledCardAnnotations =
	cardAnnotations as unknown as CardAnnotationsLookup;

if (import.meta.env.DEV) {
	for (const cardId in bundledCardAnnotations) {
		try {
			validateCardAnnotations(bundledCardAnnotations[cardId]);
		} catch (err) {
			console.error(`Card ${cardId} didn't validate:`, err);
		}
	}
}
