import type { MouseEvent, ReactNode } from "react";
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
	const card = cardDatabase.lookup.get(cardId);

	invariant(!!card);

	const getCoords = (ev: MouseEvent) => {
		const element = ev.target as HTMLElement;

		const elementBounds = element.getBoundingClientRect();

		const coords: Coords = [
			(ev.clientX - elementBounds.left) / elementBounds.width,
			(ev.clientY - elementBounds.top) / elementBounds.height,
		];

		return coords;
	};

	return (
		<div
			style={{
				aspectRatio: cardAspectRatio,
				backgroundImage: `url("${card.imgSrc}")`,
				backgroundSize: "100% 100%",
			}}
			className={clsx(["relative", "rounded-lg", className])}
			onClick={(ev) => {
				onClick?.(getCoords(ev));
			}}
			onMouseMove={(ev) => {
				onMouseMove?.(getCoords(ev), isLeftButtonDepressed(ev.buttons));
			}}
		>
			{children}
		</div>
	);
}
