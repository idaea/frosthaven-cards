import type { ClassValue } from "clsx";
import clsx from "clsx";

import { Highlight } from "../common/Highlight";
import { Card } from "../common/Card";
import type { Coords } from "../common/Coords";

import { selectSelectedDot, useEditorStore } from "./useEditorStore";

const HIGHLIGHT_SIZE = 11;

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

	const handleMouseInput = (coords: Coords) => {
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
				handleMouseInput(coords);
			}}
			onMouseMove={(coords, isDrag) => {
				if (!isDrag) {
					return;
				}

				handleMouseInput(coords);
			}}
		>
			{[
				...(cardAnnotations?.top?.dots ?? []),
				...(cardAnnotations?.bottom?.dots ?? []),
			].map((dot) => (
				<Highlight
					key={dot.id}
					x={dot.coords[0]}
					y={dot.coords[1]}
					size={HIGHLIGHT_SIZE}
					className={clsx([
						selectedDot &&
						selectedDot.cardId === cardId &&
						dot.id === selectedDot.dot.id
							? ["bg-red-600", "pointer-events-none"]
							: ["bg-green-50", "opacity-50", "cursor-pointer"],
						"opacity-50",
					])}
					onClick={() => {
						selectDot({
							cardId,
							dotId: dot.id,
						});
					}}
				/>
			))}
		</Card>
	);
}
