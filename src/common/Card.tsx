import {
	useLayoutEffect,
	useMemo,
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
	isGhosted,
	onClick,
	onHeaderClick,
	onMouseMove,
	children,
	className,
}: {
	id: string;
	onClick?: (coords: Coords) => void;
	onHeaderClick?: () => void;
	isGhosted?: boolean;
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

	const { handleClick, handleMouseUp, handleMouseDown, handleMouseMove } =
		useMemo(() => {
			if (onClick && !onMouseMove) {
				return {
					handleClick: (ev: MouseEvent) => {
						const coords = getCoords(ev);

						onClick(coords);
					},
					onHandleMouseUp: undefined,
					onHandleMouseDown: undefined,
					onHandleMouseMove: undefined,
				};
			}

			return {
				handleClick: undefined,
				handleMouseDown: (ev: MouseEvent) => {
					if (ev.target === rootRef.current) {
						mouseDownTime.current = Date.now();
					} else {
						mouseDownTime.current = undefined;
					}
				},

				handleMouseUp: (ev: MouseEvent) => {
					if (
						mouseDownTime.current &&
						(Date.now() - mouseDownTime.current < 300 ||
							onMouseMove === undefined)
					) {
						onClick?.(lastMousePosRef.current ?? getCoords(ev));
					}
				},

				handleMouseMove: (ev: MouseEvent<HTMLElement>) => {
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
			};
		}, [onClick, onMouseMove, onHeaderClick]);

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
				isGhosted && "hover:opacity-70 opacity-40",
			])}
			onClick={handleClick}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
		>
			{onHeaderClick && (
				<div
					className="absolute cursor-pointer"
					onClick={() => {
						onHeaderClick();
					}}
					style={{
						top: 0,
						left: 0,
						right: 0,
						height: "10%",
					}}
				/>
			)}

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
