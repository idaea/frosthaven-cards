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
		glowColor?: string;
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

						// if image, full color until 20%, since most of the highlight is hidden behind the image
						// transparent at 70%, since that's the edge of a circle (calculated with ~(root 2) / 2)
						background: `radial-gradient(
							hsl(from ${highlight.color} h s l / ${highlight.opacity}) ${image ? "20%" : 0},
							transparent 70%
						)`,

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

						...(image.glowColor
							? {
									filter: `drop-shadow(0px 0px 5px ${image.glowColor})`,
								}
							: undefined),

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
