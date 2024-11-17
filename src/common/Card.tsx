import {
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
	type MouseEvent,
	type ReactNode,
} from "react";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import invariant from "tiny-invariant";

import { cardDatabase } from "../card-data";
import { isLeftButtonDepressed } from "../util/isLeftButtonDepressed";

import type { Coords } from "./Coords";
import { cardAspectRatio } from "./card-dimensions";

export function Card({
	id: cardId,
	onClick,
	onMouseMove,
	children,
	className,
}: {
	id: string;
	onClick?: (coords: Coords) => void;
	onMouseMove?: (coords: Coords, isDrag: boolean) => void;
	className?: ClassValue;
	children: ReactNode;
}) {
	const imageRef = useRef<HTMLImageElement | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const card = cardDatabase.lookup.get(cardId);
	invariant(!!card);

	useLayoutEffect(() => {
		const imageElement = imageRef.current;

		if (!imageElement) {
			// should never happen
			return;
		}

		if (imageElement.complete) {
			setIsLoading(false);
		} else {
			const handler = () => {
				setIsLoading(false);
			};

			imageElement.addEventListener("load", handler);

			return () => {
				imageElement.removeEventListener("load", handler);
			};
		}
	}, []);

	const handleClick = useCallback(
		(ev: MouseEvent) => {
			onClick?.(getCoords(ev));
		},
		[onClick]
	);

	const handleMouseMove = useCallback(
		(ev: MouseEvent) => {
			onMouseMove?.(getCoords(ev), isLeftButtonDepressed(ev.buttons));
		},
		[onMouseMove]
	);

	return (
		<div
			style={{
				aspectRatio: cardAspectRatio,
			}}
			className={clsx([
				"relative",
				"rounded-lg",
				"overflow-hidden",
				className,
				isLoading && "card-hidden",
			])}
		>
			{/* Shows the card name during loading. I think this actually creates more distraction than value. */}
			{/* {isLoading && (
				<div className="card-name w-full text-center mt-[1em] text-3xl px-4 opacity-60 pointer-events-none select-none">
					{card.name}
				</div>
			)} */}
			<img
				src={card.imgSrc}
				ref={imageRef}
				className="w-full h-full"
				style={{
					borderRadius: "inherit",
				}}
				onClick={handleClick}
				onMouseMove={handleMouseMove}
			/>

			{children}
		</div>
	);
}

function getCoords(ev: MouseEvent) {
	const element = ev.target as HTMLElement;

	const elementBounds = element.getBoundingClientRect();

	const coords: Coords = [
		(ev.clientX - elementBounds.left) / elementBounds.width,
		(ev.clientY - elementBounds.top) / elementBounds.height,
	];

	return coords;
}
