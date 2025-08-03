import squareSvg from "../images/square.svg";
import diamondSvg from "../images/diamond.svg";
import diamondPlusSvg from "../images/diamond-plus.svg";
import circleSvg from "../images/circle.svg";
// import hexSvg from "../frosthaven-data/icons/general/fh-hex-empty-color-icon.png";
import hexSvg from "../images/hex.svg";

import { DotShape } from "../card-data";

const mapping = {
	square: squareSvg,
	circle: circleSvg,
	diamond: diamondSvg,
	"diamond-plus": diamondPlusSvg,
	hex: hexSvg,
} as const satisfies Record<DotShape, string>;

export function getDotShapeIconSrc(dotShape: DotShape): string {
	return mapping[dotShape];
}
