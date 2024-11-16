import { Highlight } from "../common/Highlight";
import { Card } from "../common/Card";
import { enhancementStickerTypeLookup } from "../common/enhancementStickerTypes";

import { selectCostCalculator, useMainAppStore } from "./useMainAppStore";
import { StickerSelector } from "./StickerSelector";
import type { CardViewModel, DotViewModel } from "./viewModelDatabase";
import { cardDatabase } from "../card-data";
import { getCharacterByID } from "../common/characters";
import { getDotShapeIconSrc } from "../common/getDotShapeIconSrc";

export function MainAppCard({
	card,
	onSelectDot,
	selectedDot,
}: {
	card: CardViewModel;
	selectedDot?: DotViewModel | undefined;
	onSelectDot?: (dot: DotViewModel | undefined) => void;
}) {
	const addSticker = useMainAppStore((state) => state.addSticker);
	const removeSticker = useMainAppStore((state) => state.removeSticker);

	return (
		<Card id={card.id}>
			{card.dots.map((dot) => {
				return (
					<CardDot
						key={dot.id}
						dot={dot}
						onClick={() => {
							onSelectDot?.(dot);
						}}
					/>
				);
			})}
			{selectedDot && selectedDot.cardId === card.id && (
				<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
					<StickerSelector
						className="absolute"
						dot={selectedDot}
						onAddSticker={(sticker) => {
							addSticker(selectedDot.id, sticker);
							onSelectDot?.(undefined);
						}}
						onRemoveSticker={() => {
							removeSticker(selectedDot.id);
							onSelectDot?.(undefined);
						}}
						onClose={() => {
							onSelectDot?.(undefined);
						}}
					/>
				</div>
			)}
		</Card>
	);
}

function CardDot({
	dot,
	onClick,
}: {
	dot: DotViewModel;
	onClick?: () => void;
}) {
	const dotIDToSticker = useMainAppStore((state) => state.dotIDToSticker);
	const calculateDotCost = useMainAppStore(selectCostCalculator);

	const character = getCharacterByID(
		cardDatabase.lookup.get(dot.cardId)!.character
	);

	const sticker =
		dotIDToSticker[dot.id] !== undefined
			? enhancementStickerTypeLookup[dotIDToSticker[dot.id]]
			: undefined;

	const [x, y] = dot.coords;

	return (
		<>
			<Highlight
				key={dot.id}
				x={x}
				y={y}
				image={{
					src: sticker?.iconSrc ?? getDotShapeIconSrc(dot.dotShape),
					size: sticker ? (sticker.id === "hex" ? 11.5 : 9) : 6,
				}}
				highlight={
					sticker
						? undefined
						: {
								color: `hsl(from ${character.colour} calc(h + 180) 100% 70%)`,
								// be brighter on top half since the background is brighter
								opacity: dot.cardHalf === "top" ? 1 : 0.8,
								size: 16,
							}
				}
				onClick={() => {
					onClick?.();
				}}
			/>

			{sticker && (
				<span
					className="absolute font-[Gloomhaven] text-yellow-500 pointer-events-none leading-none"
					style={{
						left: `${(3 + x * 100).toFixed(2)}%`,
						top: `${(3 + y * 100).toFixed(2)}%`,
						textShadow: "2px 2px black",
					}}
				>
					{calculateDotCost(dot, sticker.id)}
				</span>
			)}
		</>
	);
}
