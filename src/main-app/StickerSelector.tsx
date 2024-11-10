import type { ClassValue } from "clsx";
import clsx from "clsx";

import { IconButton } from "../common/IconButton";
import type { StickerTypeID } from "../common/enhancementStickerTypes";
import deleteSvgIcon from "../images/delete.svg";

import { getValidStickersForDot } from "./getValidStickersForDot";
import { selectCostCalculator, useMainAppStore } from "./useMainAppStore";
import type { DotViewModel } from "./viewModelDatabase";


export function StickerSelector({
	dot,
	className,
	onAddSticker,
	onRemoveSticker,
	onClose,
}: {
	dot: DotViewModel;
	className?: ClassValue;
	onAddSticker?: (sticker: StickerTypeID) => void;
	onRemoveSticker?: () => void;
	onClose?: () => void;
}) {
	const calculateDotCost = useMainAppStore(selectCostCalculator);
	const selectedSticker = useMainAppStore((state) =>
		dot ? state.dotIDToSticker[dot.id] : undefined
	);

	const validStickers = getValidStickersForDot(dot);
	const gridColumns = Math.min(validStickers.length + 1, 4);

	return (
		<div
			className={clsx(
				"grid",
				"gap-1",
				gridColumns === 1 && "grid-cols-1",
				gridColumns === 2 && "grid-cols-2",
				gridColumns === 3 && "grid-cols-3",
				gridColumns === 4 && "grid-cols-4",
				"bg-white bg-opacity-80 p-2 rounded-lg",
				"text-sm",
				"select-none",
				className
			)}
			onClick={(ev) => {
				ev.stopPropagation();
			}}
		>
			{getValidStickersForDot(dot).map((sticker) => (
				<div
					key={sticker.id}
					className="flex flex-col gap-1 items-center leading-none"
				>
					<IconButton
						src={sticker.iconSrc}
						size="sm"
						selected={selectedSticker === sticker.id}
						onClick={() => {
							if (selectedSticker !== sticker.id) {
								onAddSticker?.(sticker.id);
							} else {
								onClose?.();
							}
						}}
					/>
					<span>{calculateDotCost(dot, sticker.id)}</span>
				</div>
			))}

			<div className="flex flex-col gap-1 items-center leading-none">
				<IconButton
					src={deleteSvgIcon}
					size="sm"
					onClick={() => {
						onRemoveSticker?.();
					}}
				/>
			</div>
		</div>
	);
}
