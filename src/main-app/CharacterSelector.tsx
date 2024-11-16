import clsx, { type ClassValue } from "clsx";
import { useMemo } from "react";
import { type Character, characters } from "../common/characters";
import { IconButton } from "../common/IconButton";
import { useMainAppStore } from "./useMainAppStore";

export function CharacterSelector({
	selectedCharacter,
	onSelectCharacter,
	className,
}: {
	selectedCharacter: Character;
	onSelectCharacter?: (character: Character) => void;
	className?: ClassValue;
}) {
	const unlockedCharacters = useMainAppStore(
		(state) => state.unlockedCharacters
	);

	const viewModels = useMemo(() => {
		return characters
			.map((c) => ({
				...c,
				isLocked:
					c.isAlwaysUnlocked !== true && unlockedCharacters[c.id] !== true,
				isSelected: c.id === selectedCharacter.id,
			}))
			.sort((a, b) => {
				if (a.isLocked && !b.isLocked) {
					return 1;
				} else if (b.isLocked && !a.isLocked) {
					return -1;
				} else {
					return 0;
				}
			});
	}, [unlockedCharacters, selectedCharacter]);

	return (
		<div
			className={clsx(
				"flex gap-1.5 justify-end flex-wrap items-center",
				className
			)}
		>
			{viewModels.map((c) => (
				<IconButton
					key={c.id}
					src={c.iconSrc}
					color={c.colour}
					size={c.isSelected ? "xl" : c.isLocked ? "md" : "lg"}
					sizeResponsive
					selected={c.isSelected}
					renderAsDisabled={c.isLocked}
					onClick={() => {
						onSelectCharacter?.(c);
					}}
				/>
			))}
		</div>
	);
}
