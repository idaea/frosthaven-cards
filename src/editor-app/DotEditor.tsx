import type { ClassValue } from "clsx";
import clsx from "clsx";
import invariant from "tiny-invariant";
import trapIcon from "../frosthaven-data/icons/characters/fh-trapper-bw-icon.png";
import tokenIcon from "../frosthaven-data/icons/class/fh-deathwalker-shadow-bw-icon.png";
import strengthenIcon from "../frosthaven-data/icons/conditions/fh-strengthen-bw-icon.png";
import poisonIcon from "../frosthaven-data/icons/conditions/fh-poison-bw-icon.png";

import type {
	PlayerPlus1Target,
	SummonPlus1Target,
} from "../common/plus-1-targets";
import { canAffectMultiple } from "../common/plus-1-targets";
import { getPlus1ImgSrc } from "../common/getPlus1ImgSrc";
import { IconButton } from "../common/IconButton";
import { TextButton } from "../common/TextButton";
import type { DotShape } from "../card-data";
import { enhancementStickerTypeLookup as s } from "../common/enhancementStickerTypes";

import { selectSelectedDot, useEditorStore } from "./useEditorStore";
import { getDotShapeIconSrc } from "../common/getDotShapeIconSrc";
import { useId } from "react";

const moveIcon = getPlus1ImgSrc("move");
const attackIcon = getPlus1ImgSrc("attack");
const rangeIcon = getPlus1ImgSrc("range");
const targetIcon = getPlus1ImgSrc("target");
const shieldIcon = getPlus1ImgSrc("shield");
const retaliateIcon = getPlus1ImgSrc("retaliate");
const pierceIcon = getPlus1ImgSrc("pierce");
const healIcon = getPlus1ImgSrc("heal");
const pushIcon = getPlus1ImgSrc("push");
const pullIcon = getPlus1ImgSrc("pull");
const teleportIcon = getPlus1ImgSrc("teleport");

const plus1Icon = s["plus1"].iconSrc;

export function DotEditor({ className }: { className?: ClassValue }) {
	const selectedDot = useEditorStore(selectSelectedDot);
	const clearSelectedDot = useEditorStore(
		(state) => state.dots.clearSelectedDot
	);
	const deleteSelectedDot = useEditorStore(
		(state) => state.dots.deleteSelectedDot
	);

	if (selectedDot === undefined) {
		return null;
	}

	return (
		<div className={clsx(["p-4", className])}>
			<EnhanceableSelector />

			<div className="flex gap-1 mt-2">
				<TextButton
					className="font-bold bg-white"
					onClick={() => {
						clearSelectedDot();
					}}
				>
					Save
				</TextButton>

				<TextButton
					className="bg-red-300"
					onClick={() => {
						deleteSelectedDot();
					}}
				>
					Delete
				</TextButton>
			</div>
		</div>
	);
}

function DotShapeSelector({
	value,
	onChange,
	className,
}: {
	value: DotShape;
	onChange?: (shape: DotShape) => void;
	className?: ClassValue;
}) {
	return (
		<div className={clsx("flex", "gap-1", className)}>
			{(["square", "circle", "diamond", "diamond-plus", "hex"] as const).map(
				(dotShape) => (
					<IconButton
						key={dotShape}
						src={getDotShapeIconSrc(dotShape)}
						selected={value === dotShape}
						onClick={() => {
							if (value !== dotShape) {
								onChange?.(dotShape);
							}
						}}
					/>
				)
			)}
		</div>
	);
}

function EnhanceableSelector() {
	const selectedDot = useEditorStore(selectSelectedDot);
	const editSelectedDot = useEditorStore(
		(state) => state.dots.editSelectedDot
	);

	invariant(!!selectedDot);

	const { plus1Target, affectsMultiple, baseNumHexes, isPersistent } =
		selectedDot.dot.enhanceableDetails;

	const canShowAffectsMultiple = canAffectMultiple(plus1Target);

	const typesOfPlayerPlusOne = [
		["move", moveIcon],
		["move-token", moveIcon, tokenIcon],
		["attack", attackIcon],
		["attack-trap", attackIcon, trapIcon],
		["range", rangeIcon],
		["target", targetIcon],
		["shield", shieldIcon],
		["retaliate", retaliateIcon],
		["pierce", pierceIcon],
		["heal", healIcon],
		["heal-trap", healIcon, trapIcon],
		["push", pushIcon],
		["pull", pullIcon],
		["teleport", teleportIcon],
	] as Array<[PlayerPlus1Target, string, string?]>;

	const typesOfSummonPlusOne = [
		["summon-hp", healIcon],
		["summon-move", moveIcon],
		["summon-attack", attackIcon],
		["summon-range", rangeIcon],
	] as Array<[SummonPlus1Target, string]>;

	const priorEnhanceableDetails = selectedDot.dot.enhanceableDetails;

	const id_abilityIsPersistent = useId();

	return (
		<div>
			<DotShapeSelector
				className="mb-2"
				value={priorEnhanceableDetails.dotShape}
				onChange={(dotShape) => {
					if (dotShape === "hex") {
						editSelectedDot({
							enhanceableDetails: {
								dotShape: "hex",
								affectsMultiple: false,
								baseNumHexes: 1,
								plus1Target: undefined,
							},
						});
					} else if (priorEnhanceableDetails.dotShape === "hex") {
						editSelectedDot({
							enhanceableDetails: {
								dotShape,
								plus1Target: "move",
								affectsMultiple: false,
								baseNumHexes: undefined,
							},
						});
					} else {
						editSelectedDot({
							enhanceableDetails: {
								dotShape,
							},
						});
					}
				}}
			/>

			{priorEnhanceableDetails.dotShape === "hex" ? (
				<div className="flex items-center">
					<label htmlFor="base-hex-count">Base # hexes:</label>
					<input
						type="number"
						value={baseNumHexes}
						onChange={(e) => {
							const newValue = parseInt(
								(e.target as HTMLInputElement).value
							);

							if (!Number.isNaN(newValue)) {
								editSelectedDot({
									enhanceableDetails: {
										dotShape: "hex",
										plus1Target: undefined,
										affectsMultiple: true,
										baseNumHexes: newValue,
									},
								});
							}
						}}
						id="base-hex-count"
						className="ml-1 px-1 w-[3rem] border rounded-sm border-black"
					/>
				</div>
			) : (
				<>
					<div>
						<input
							type="checkbox"
							{...(canShowAffectsMultiple
								? {
										checked: affectsMultiple,
										onChange: (e) => {
											editSelectedDot({
												enhanceableDetails: {
													affectsMultiple: (
														e.target as HTMLInputElement
													).checked,
												},
											});
										},
									}
								: { checked: false, disabled: true })}
							id="player-affects-multiple"
							className="mr-1"
						/>
						<label
							htmlFor="player-affects-multiple"
							className={clsx(!canShowAffectsMultiple && "opacity-50")}
						>
							Affects multiple?
						</label>
					</div>

					<div>
						<input
							type="checkbox"
							checked={isPersistent}
							onChange={(e) => {
								editSelectedDot({
									enhanceableDetails: {
										isPersistent: (e.target as HTMLInputElement)
											.checked,
									},
								});
							}}
							id={id_abilityIsPersistent}
							className="mr-1"
						/>
						<label htmlFor={id_abilityIsPersistent}>
							Has persistent bonus?
						</label>
					</div>

					<h2 className="font-bold mt-1">Non-numeric</h2>
					<IconButton
						src={strengthenIcon}
						subIconSrc={poisonIcon}
						selected={plus1Target === undefined}
						disabled={priorEnhanceableDetails.dotShape === "square"}
						onClick={() => {
							editSelectedDot({
								enhanceableDetails: {
									dotShape: priorEnhanceableDetails.dotShape,
									plus1Target: undefined,
									affectsMultiple: affectsMultiple,
									baseNumHexes: undefined,
								},
							});
						}}
					/>

					<h2 className="font-bold mt-1">
						Player <img src={plus1Icon} className="w-4 h-4 inline" />
					</h2>
					<div className="flex gap-1 flex-wrap">
						{typesOfPlayerPlusOne.map(
							([enhanceType, iconSrc, subIconSrc]) => (
								<IconButton
									key={enhanceType}
									src={iconSrc}
									subIconSrc={subIconSrc}
									selected={enhanceType === plus1Target}
									onClick={() => {
										editSelectedDot({
											enhanceableDetails: canAffectMultiple(
												enhanceType
											)
												? {
														dotShape:
															priorEnhanceableDetails.dotShape,
														plus1Target: enhanceType,
														affectsMultiple: affectsMultiple,
														baseNumHexes: undefined,
													}
												: {
														dotShape:
															priorEnhanceableDetails.dotShape,
														plus1Target: enhanceType,
														affectsMultiple: false,
														baseNumHexes: undefined,
													},
										});
									}}
								/>
							)
						)}
					</div>

					<h2 className="font-bold mt-1">
						Summon <img src={plus1Icon} className="w-4 h-4 inline" />
					</h2>
					<div className="flex gap-1 flex-wrap">
						{typesOfSummonPlusOne.map(([enhanceType, iconSrc]) => (
							<IconButton
								src={iconSrc}
								selected={enhanceType === plus1Target}
								onClick={() => {
									editSelectedDot({
										enhanceableDetails: canAffectMultiple(enhanceType)
											? {
													dotShape:
														priorEnhanceableDetails.dotShape,
													plus1Target: enhanceType,
													affectsMultiple: affectsMultiple,
													baseNumHexes: undefined,
												}
											: {
													dotShape:
														priorEnhanceableDetails.dotShape,
													plus1Target: enhanceType,
													affectsMultiple: false,
													baseNumHexes: undefined,
												},
									});
								}}
								key={enhanceType}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
}
