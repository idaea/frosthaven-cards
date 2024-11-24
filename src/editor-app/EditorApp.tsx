import { useEffect, useId } from "react";
import invariant from "tiny-invariant";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { useNavigate, useParams } from "react-router-dom";

import type { CardAction } from "../card-data";
import { cardDatabase } from "../card-data";
import { getCharacterByID } from "../common/characters";
import { getDesaturatedColour } from "../common/getDesaturatedColour";
import { TextButton } from "../common/TextButton";
import type { CardData } from "../CardData";

import { DotEditor } from "./DotEditor";
import {
	selectSelectedDot,
	selectNearbyCards,
	useEditorStore,
	selectCardAnnotations,
} from "./useEditorStore";
import { EditorCard } from "./EditorCard";
import { CharacterSelector } from "../main-app/CharacterSelector";

export const HIGHLIGHT_SIZE = 24;

export { EditorApp as Component };

function EditorApp() {
	const routeParams = useParams();
	const navigate = useNavigate();

	const goToCard = (card: CardData) => {
		navigate({
			pathname: `/editor/${card.id}`,
		});
	};

	const currentCard =
		(routeParams["cardId"]
			? cardDatabase.lookup.get(routeParams["cardId"])
			: undefined) ?? cardDatabase.cards[0];
	invariant(!!currentCard);

	const currentCardAnnotations = useEditorStore((state) =>
		selectCardAnnotations(state, currentCard.id)
	);
	const hasSelectedDot = useEditorStore(
		(state) => selectSelectedDot(state)?.cardId === currentCard.id
	);

	const character = getCharacterByID(currentCard.character);

	const setCardAnnotations = useEditorStore(
		(state) => state.setCardAnnotations
	);

	invariant(!!currentCard);

	return (
		<div
			className="p-8 flex items-center flex-col min-h-screen"
			style={{
				"--character-color": character.colour,
				backgroundColor: getDesaturatedColour("var(--character-color)"),
			}}
		>
			<TextButton
				className="fixed top-4 right-4 bg-white"
				onClick={() => {
					const data = JSON.parse(localStorage.getItem("editor") ?? "{}")
						.state.cardAnnotationsLookup;

					navigator.clipboard.writeText(JSON.stringify(data, null, 2));
				}}
			>
				Export
			</TextButton>

			<CharacterSelector
				selectedCharacter={character}
				onSelectCharacter={(newCharacter) => {
					const firstCard = cardDatabase.cards.find(
						(c) => c.character === newCharacter.id
					);
					if (firstCard) {
						goToCard(firstCard);
					}
				}}
			/>

			<CardSelector
				className="mb-2"
				currentCard={currentCard}
				goToCard={goToCard}
			/>

			<div className="flex w-full h-[480px] md:h-[600px] lg:h-[720px]">
				{hasSelectedDot ? (
					<DotEditor className="flex-1 min-w-0 p-4" />
				) : (
					<div className="flex-1 min-w-0 p-4" />
				)}

				<EditorCard
					id={currentCard.id}
					className={["h-full", "flex-0"]}
					// use key because if the component instance is reused then tracking image loading gets more complex
					key={currentCard.id}
				/>

				<div className="flex-1 min-w-0 relative p-4">
					<CardHalfEditor
						cardAction={currentCardAnnotations.top}
						onChange={(newDetails) => {
							setCardAnnotations(currentCard.id, { top: newDetails });
						}}
						className="absolute top-[43%]"
					/>
					<CardHalfEditor
						cardAction={currentCardAnnotations.bottom}
						onChange={(newDetails) => {
							setCardAnnotations(currentCard.id, {
								bottom: newDetails,
							});
						}}
						className="absolute bottom-[2.75%]"
					/>
				</div>
			</div>
		</div>
	);
}

function CardSelector({
	currentCard,
	className,
	goToCard,
}: {
	currentCard: CardData;
	className?: ClassValue;
	goToCard: (card: CardData) => void;
}) {
	const { nextCard, nextNewCard, previousCard, previousNewCard } =
		useEditorStore((state) => selectNearbyCards(state, currentCard));

	useEffect(() => {
		const handler = (ev: KeyboardEvent) => {
			if (ev.key === "ArrowLeft" && previousCard !== undefined) {
				goToCard(previousCard);
			} else if (ev.key === "ArrowRight" && nextCard !== undefined) {
				goToCard(nextCard);
			}
		};

		document.body.addEventListener("keydown", handler);
		return () => {
			document.body.removeEventListener("keydown", handler);
		};
	}, [previousCard, nextCard, goToCard]);

	return (
		<div className={clsx(className, "flex gap-2", "select-none")}>
			<ArrowButton
				arrow="←"
				disabled={previousNewCard === undefined}
				onClick={() => {
					if (previousNewCard !== undefined) {
						goToCard(previousNewCard);
					}
				}}
				className="font-bold"
			/>
			<ArrowButton
				arrow="←"
				disabled={previousCard === undefined}
				onClick={() => {
					if (previousCard !== undefined) {
						goToCard(previousCard);
					}
				}}
			/>
			{currentCard.cardNumber}
			<ArrowButton
				arrow="→"
				disabled={nextCard === undefined}
				onClick={() => {
					if (nextCard !== undefined) {
						goToCard(nextCard);
					}
				}}
			/>
			<ArrowButton
				arrow="→"
				disabled={nextNewCard === undefined}
				onClick={() => {
					if (nextNewCard !== undefined) {
						goToCard(nextNewCard);
					}
				}}
				className="font-bold"
			/>
		</div>
	);
}

function ArrowButton({
	arrow,
	disabled,
	onClick,
	className,
}: {
	arrow: string;
	disabled?: boolean;
	onClick?: () => void;
	className?: ClassValue;
}) {
	return (
		<span
			className={clsx(
				className,
				disabled ? "text-gray-500" : "cursor-pointer",
				"select-none"
			)}
			onClick={(ev) => {
				ev.stopPropagation();
				ev.preventDefault();
				onClick?.();
			}}
		>
			{arrow}
		</span>
	);
}

function CardHalfEditor({
	cardAction,
	onChange,
	className,
}: {
	cardAction: CardAction;
	onChange?: (cardAction: Partial<CardAction>) => void;
	className?: ClassValue;
}) {
	const id_isLoss = useId();
	const id_isPersistent = useId();

	return (
		<div className={clsx("flex", "flex-col", "text-nowrap", className)}>
			<div>
				<input
					type="checkbox"
					checked={cardAction.isLoss}
					onChange={() => {
						onChange?.({
							isLoss: !cardAction.isLoss,
						});
					}}
					id={id_isLoss}
				/>
				<label className="pl-1" htmlFor={id_isLoss}>
					Loss?
				</label>
			</div>

			<div>
				<input
					type="checkbox"
					checked={cardAction.isPersistent}
					onChange={() => {
						onChange?.({
							isPersistent: !cardAction.isPersistent,
						});
					}}
					id={id_isPersistent}
				/>
				<label className="pl-1" htmlFor={id_isPersistent}>
					Persistent?
				</label>
			</div>
		</div>
	);
}
