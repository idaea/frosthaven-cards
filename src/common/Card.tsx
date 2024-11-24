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

import type { Coords } from "./geometry/Coords";
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
	onMouseMove?: (
		lastCoords: Coords,
		newCoords: Coords,
		isDrag: boolean
	) => void;
	className?: ClassValue;
	children: ReactNode;
}) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const imageRef = useRef<HTMLImageElement | null>(null);
	const lastMousePosRef = useRef<Coords>();
	const mouseDownTime = useRef<number | undefined>();

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

	const handleMouseDown = useCallback(
		(ev: MouseEvent) => {
			if (ev.target === rootRef.current) {
				mouseDownTime.current = Date.now();
			} else {
				mouseDownTime.current = undefined;
			}
		},
		[onClick]
	);

	const handleMouseUp = useCallback(
		(ev: MouseEvent) => {
			if (
				mouseDownTime.current &&
				(Date.now() - mouseDownTime.current < 300 ||
					onMouseMove === undefined)
			) {
				onClick?.(lastMousePosRef.current ?? getCoords(ev));
			}
		},
		[onClick]
	);

	const handleMouseMove = useCallback(
		(ev: MouseEvent<HTMLElement>) => {
			const coords = getCoords(ev);
			if (lastMousePosRef.current) {
				onMouseMove?.(
					lastMousePosRef.current,
					coords,
					isLeftButtonDepressed(ev.buttons)
				);
			}
			lastMousePosRef.current = coords;
		},
		[onMouseMove]
	);

	return (
		<div
			ref={rootRef}
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
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
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
				className="w-full h-full pointer-events-none"
				style={{
					borderRadius: "inherit",
				}}
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
