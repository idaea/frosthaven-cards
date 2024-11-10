import type { CardAnnotationsLookup } from "./card-data";
import cardAnnotations from "./data/card-annotations.json";

export const bundledCardAnnotations =
	cardAnnotations as unknown as CardAnnotationsLookup;
