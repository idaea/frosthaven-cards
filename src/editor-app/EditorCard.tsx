import type { ClassValue } from "clsx";

import { Highlight } from "../common/Highlight";
import { Card } from "../common/Card";
import type { Coords } from "../common/geometry/Coords";

import { selectSelectedDot, useEditorStore } from "./useEditorStore";
import { getDotShapeIconSrc } from "../common/getDotShapeIconSrc";
import {
	coordsAdd,
	coordsScale,
	coordsSubtract,
} from "../common/geometry/coords-utils";

export function EditorCard({
	id: cardId,
	className,
}: {
	id: string;
	className: ClassValue;
}) {
	const selectedDot = useEditorStore(selectSelectedDot);
	const store_placeProtoDot = useEditorStore((state) => state.dots.placeDot);
	const store_editSelectedDot = useEditorStore(
		(state) => state.dots.editSelectedDot
	);
	const selectDot = useEditorStore((state) => state.dots.selectDot);
	const cardAnnotations = useEditorStore(
		(state) => state.cardAnnotationsLookup[cardId]
	);

	const placeDot = (coords: Coords) => {
		if (selectedDot && selectedDot.cardId === cardId) {
			store_editSelectedDot({
				coords,
			});
		} else {
			store_placeProtoDot({ cardId, coords });
		}
	};

	return (
		<Card
			id={cardId}
			className={className}
			onClick={(coords) => {
				placeDot(coords);
			}}
			onMouseMove={(lastCoords, newCoords, isDrag) => {
				if (!isDrag || !selectedDot) {
					return;
				}

				const dragVector = coordsSubtract(newCoords, lastCoords);
				const newDotCoords = coordsAdd(
					selectedDot.dot.coords,
					coordsScale(dragVector, 0.25)
				);

				store_editSelectedDot({
					coords: newDotCoords,
				});
			}}
		>
			{[
				...(cardAnnotations?.top?.dots ?? []),
				...(cardAnnotations?.bottom?.dots ?? []),
			].map((dot) => {
				const isSelected = selectedDot && dot.id === selectedDot.dot.id;
				return (
					<Highlight
						key={dot.id}
						x={dot.coords[0]}
						y={dot.coords[1]}
						image={{
							src: getDotShapeIconSrc(dot.enhanceableDetails.dotShape),
							opacity: 0.4,
							size: 6,
						}}
						highlight={{
							color: isSelected ? "red" : "white",
							opacity: 0.4,
							size: 16,
						}}
						onClick={
							isSelected
								? undefined
								: () => {
										selectDot({
											cardId,
											dotId: dot.id,
										});
									}
						}
					/>
				);
			})}
		</Card>
	);
}
