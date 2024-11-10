import type { ClassValue } from "clsx";
import clsx from "clsx";

import { cardAspectRatio } from "./card-dimensions";

export function Highlight({
	className,
	size,
	imgSrc,
	onClick,
	x,
	y,
}: {
	x: number;
	y: number;
	size: number;
	imgSrc?: string;
	className?: ClassValue;
	onClick?: () => void;
}) {
	const wPct = size;
	const hPct = size * cardAspectRatio;

	return (
		<div
			className={clsx("absolute", !imgSrc && ["rounded-full"], className)}
			style={{
				...(imgSrc
					? {
							backgroundImage: `url("${imgSrc}")`,
							backgroundSize: "100% 100%",
						}
					: undefined),
				width: `${wPct}%`,
				height: `${hPct}%`,
				left: `${(x * 100 - wPct / 2).toFixed(2)}%`,
				top: `${(y * 100 - hPct / 2).toFixed(2)}%`,
			}}
			onClick={(ev) => {
				ev.stopPropagation();
				ev.preventDefault();

				onClick?.();
			}}
		/>
	);
}
