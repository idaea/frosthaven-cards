import { cardAspectRatio } from "./card-dimensions";
import { CSSProperties, MouseEvent } from "react";

export function Highlight({
	x,
	y,
	highlight,
	image,
	onClick,
}: {
	x: number;
	y: number;
	highlight?: {
		color: string;
		opacity: number;
		size: number;
	};
	image?: {
		src: string;
		opacity?: number;
		size: number;
	};
	onClick?: () => void;
}) {
	const handleClick = (ev: MouseEvent) => {
		ev.stopPropagation();
		ev.preventDefault();

		onClick?.();
	};

	const commonStyles: CSSProperties = {
		position: "absolute",
		cursor: onClick ? "pointer" : undefined,
		pointerEvents: onClick ? undefined : "none",
	};

	return (
		<>
			{highlight && (
				<div
					style={{
						...commonStyles,

						borderRadius: "9999px",
						// 70% is so it reaches transparent at the edge of the circle, is ~(root 2) / 2
						background: `radial-gradient(hsl(from ${highlight.color} h s l / ${highlight.opacity}), transparent 70%)`,

						...pos(x, y, highlight.size),
					}}
					onClick={handleClick}
				/>
			)}
			{image && (
				<div
					style={{
						...commonStyles,

						backgroundImage: `url("${image.src}")`,
						backgroundPosition: "center center",
						backgroundSize: "contain",
						backgroundRepeat: "no-repeat",
						opacity: image.opacity ?? 1,

						...pos(x, y, image.size),
					}}
					onClick={handleClick}
				/>
			)}
		</>
	);
}

function pos(x: number, y: number, size: number): CSSProperties {
	const wPct = size;
	const hPct = size * cardAspectRatio;

	return {
		width: `${wPct}%`,
		height: `${hPct}%`,
		left: `${(x * 100 - wPct / 2).toFixed(2)}%`,
		top: `${(y * 100 - hPct / 2).toFixed(2)}%`,
	};
}
