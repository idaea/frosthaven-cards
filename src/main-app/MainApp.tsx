import { useId, useMemo, useState } from "react";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { useNavigate, useParams } from "react-router-dom";

import { IconButton } from "../common/IconButton";
import type {
	Character} from "../common/characters";
import {
	characters,
	getCharacterByShortID,
	parseShortCharacterID,
} from "../common/characters";
import { getDesaturatedColour } from "../common/getDesaturatedColour";
import { TextButton } from "../common/TextButton";

import { MainAppCard } from "./MainAppCard";
import { useMainAppStore } from "./useMainAppStore";
import type { DotViewModel} from "./viewModelDatabase";
import { viewModelDatabase } from "./viewModelDatabase";



export { MainApp as Component };

function MainApp() {
	const routeParams = useParams();

	const navigate = useNavigate();

	const [selectedDot, setSelectedDot] = useState<DotViewModel>();

	const enhancerLevel = useMainAppStore((state) => state.enhancerLevel);
	const setEnhancerLevel = useMainAppStore((state) => state.setEnhancerLevel);

	const enhancementPermanence = useMainAppStore(
		(state) => state.enhancementPermanence
	);
	const setEnhancementPermanence = useMainAppStore(
		(state) => state.setEnhancementPermanence
	);

	const unlockedCharacters = useMainAppStore(
		(state) => state.unlockedCharacters
	);
	const unlockCharacter = useMainAppStore((state) => state.unlockCharacter);

	const selectedCharacter = getCharacterByShortID(
		parseShortCharacterID(routeParams["characterId"]) ?? characters[0].shortId
	);
	const selectedCharacterIsLocked =
		selectedCharacter.isAlwaysUnlocked !== true &&
		unlockedCharacters[selectedCharacter.id] !== true;

	const elementID_temporaryStickers = useId();
	const elementID_enhancerLevel = useId();

	return (
		<div
			className="p-3 min-h-screen"
			style={{
				backgroundColor: getDesaturatedColour(selectedCharacter.colour),
			}}
			onClick={() => {
				setSelectedDot(undefined);
			}}
		>
			<div className="flex justify-between gap-8 mb-2">
				<div className="flex flex-col flex-0 gap-1 md:pl-1 font-[Gloomhaven]">
					<div className="whitespace-nowrap">
						<input
							type="checkbox"
							id={elementID_temporaryStickers}
							checked={enhancementPermanence === "temporary"}
							onChange={(ev) => {
								ev.stopPropagation();

								setEnhancementPermanence(
									ev.target.checked ? "temporary" : "permanent"
								);
							}}
						/>
						<label
							className="pl-2 font-[Gloomhaven]"
							htmlFor={elementID_temporaryStickers}
						>
							Temporary stickers?
						</label>
					</div>

					<div className="flex items-center whitespace-nowrap">
						<label className="" htmlFor={elementID_enhancerLevel}>
							Enhancer
						</label>
						<input
							type="range"
							className="w-14 ml-2 mr-2"
							id={elementID_enhancerLevel}
							min={1}
							max={4}
							step={1}
							value={enhancerLevel}
							onChange={(ev) => {
								ev.stopPropagation();

								setEnhancerLevel(
									parseInt(ev.target.value, 10) as 1 | 2 | 3 | 4
								);
							}}
						/>
						<span className="font-[Gloomhaven]">{enhancerLevel}</span>
					</div>
				</div>

				<CharacterSelector
					className="grow-0 shrink"
					selectedCharacter={selectedCharacter}
					onSelectCharacter={(c) => {
						navigate({
							pathname: `/c/${c.shortId}`,
						});
					}}
				/>
			</div>

			{!selectedCharacterIsLocked ? (
				<div className="grid gap-2 lg:gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
					{viewModelDatabase.cards
						.filter((x) => x.character === selectedCharacter.id)
						.map((card) => (
							<MainAppCard
								key={card.id}
								card={card}
								selectedDot={selectedDot}
								onSelectDot={(dot) => {
									setSelectedDot(dot);
								}}
							/>
						))}
				</div>
			) : (
				<div className="flex flex-col items-center mt-12 gap-2">
					<p className="text-xl">This character is locked</p>
					<TextButton
						className="bg-white"
						onClick={() => {
							unlockCharacter(selectedCharacter);
						}}
					>
						Unlock character
					</TextButton>
				</div>
			)}
		</div>
	);
}

function CharacterSelector({
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
