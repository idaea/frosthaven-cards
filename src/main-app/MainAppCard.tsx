import { Highlight } from "../common/Highlight";
import { Card } from "../common/Card";
import { enhancementStickerTypeLookup } from "../common/enhancementStickerTypes";

import { selectCostCalculator, useMainAppStore } from "./useMainAppStore";
import { StickerSelector } from "./StickerSelector";
import type { CardViewModel, DotViewModel } from "./viewModelDatabase";

const HIGHLIGHT_SIZE = 11;
const STICKER_SIZE = 9;

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
						selectedDot={selectedDot}
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
	selectedDot,
	onClick,
}: {
	dot: DotViewModel;
	selectedDot: DotViewModel | undefined;
	onClick?: () => void;
}) {
	const dotIDToSticker = useMainAppStore((state) => state.dotIDToSticker);
	const calculateDotCost = useMainAppStore(selectCostCalculator);

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
				size={sticker ? STICKER_SIZE : HIGHLIGHT_SIZE}
				imgSrc={sticker?.iconSrc}
				className={[
					"cursor-pointer",
					sticker === undefined && [
						"bg-white",
						dot.id === selectedDot?.id
							? "opacity-30"
							: ["opacity-0", "hover:opacity-30"],
					],
				]}
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
					}}
				>
					{calculateDotCost(dot, sticker.id)}
				</span>
			)}
		</>
	);
}
