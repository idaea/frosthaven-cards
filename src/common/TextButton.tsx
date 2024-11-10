import clsx from "clsx";
import type {ClassValue} from "clsx";

export function TextButton({
	onClick,
	children,
	className,
}: {
	onClick?: () => void;
	children: string;
	className?: ClassValue;
}) {
	return (
		<button
			className={clsx(
				"p-2",
				"border",
				"border-black",
				"leading-none",
				"cursor-pointer",
				"rounded-md",
				className
			)}
			onClick={() => {
				onClick?.();
			}}
		>
			{children}
		</button>
	);
}
