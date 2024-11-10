import clsx from "clsx";
import { useMemo } from "react";

import {
	getDarkColour,
	getVeryDesaturatedColour,
} from "./getDesaturatedColour";

type Size = "sm" | "md" | "lg" | "xl";

function getClassesForSize(size: number): string[] {
	return [`w-${size}`, `h-${size}`, `p-${size <= 6 ? 0.5 : 1}`];
}

function at(breakpoint: Size | null, iconSize: number): string[] {
	if (breakpoint === null) {
		return getClassesForSize(iconSize);
	}
	return getClassesForSize(iconSize).map((cls) => `${breakpoint}:${cls}`);
}

function generateClass(sizes: Record<Size, number>): string {
	return clsx([
		...at(null, sizes.sm),
		...at("md", sizes.md),
		...at("lg", sizes.lg),
		...at("xl", sizes.xl),
	]);
}

const finalSizes = {
	sm: {
		responsive: generateClass({
			sm: 5,
			md: 5,
			lg: 6,
			xl: 6,
		}),
		fixed: clsx(getClassesForSize(6)),
	},

	md: {
		responsive: generateClass({
			sm: 5,
			md: 6,
			lg: 8,
			xl: 8,
		}),
		fixed: clsx(getClassesForSize(8)),
	},

	lg: {
		responsive: generateClass({
			sm: 6,
			md: 8,
			lg: 10,
			xl: 10,
		}),
		fixed: clsx(getClassesForSize(10)),
	},

	xl: {
		responsive: generateClass({
			sm: 8,
			md: 10,
			lg: 12,
			xl: 12,
		}),
		fixed: clsx(getClassesForSize(12)),
	},
};

export function IconButton({
	src,
	subIconSrc,
	color,
	selected = false,
	disabled = false,
	renderAsDisabled = disabled,
	size = "md",
	sizeResponsive,
	onClick,
	className,
}: {
	src: string;
	subIconSrc?: string | undefined;
	color?: string;
	selected?: boolean;
	disabled?: boolean;
	renderAsDisabled?: boolean;
	size?: "sm" | "md" | "lg" | "xl";
	sizeResponsive?: boolean;
	onClick?: () => void;
	className?: string;
}) {
	const fullClassName = useMemo(() => {
		return clsx(
			className,

			"relative",
			"rounded-md",
			sizeResponsive ? finalSizes[size].responsive : finalSizes[size].fixed,

			"border-opacity-100",
			"text-center",
			"border",
			"overflow-hidden",
			"leading-none",

			"border-1",

			!renderAsDisabled && "cursor-pointer"
		);
	}, [renderAsDisabled, size, className, sizeResponsive]);

	return (
		<button
			className={fullClassName}
			style={
				color && !renderAsDisabled
					? {
							borderColor: getDarkColour(color),
							backgroundColor: getVeryDesaturatedColour(color),
						}
					: {
							borderColor: "black",
							backgroundColor: renderAsDisabled
								? "#ddd"
								: selected
									? "#bfdbfe"
									: "white",
						}
			}
			onClick={onClick}
			disabled={disabled}
		>
			{subIconSrc ? (
				<>
					<img
						className="absolute w-3/5 h-3/5 top-0.5 left-0.5 object-contain"
						src={src}
					/>
					<img
						className="absolute w-2/5 h-2/5 bottom-0.5 right-0.5 object-contain"
						src={subIconSrc}
					/>
				</>
			) : (
				<div
					className="w-full h-full"
					style={
						color
							? {
									backgroundColor: renderAsDisabled ? "#444" : color,

									maskImage: `url("${src}")`,
									maskPosition: "center center",
									maskSize: "contain",
									maskRepeat: "no-repeat",
								}
							: {
									backgroundImage: `url("${src}")`,
									backgroundPosition: "center center",
									backgroundSize: "contain",
									backgroundRepeat: "no-repeat",
								}
					}
				/>
			)}
		</button>
	);
}
