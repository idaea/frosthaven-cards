import moveIcon from "../frosthaven-data/icons/general/fh-move-bw-icon.png";
import attackIcon from "../frosthaven-data/icons/general/fh-attack-bw-icon.png";
import rangeIcon from "../frosthaven-data/icons/general/fh-range-bw-icon.png";
import targetIcon from "../frosthaven-data/icons/general/fh-target-bw-icon.png";
import shieldIcon from "../frosthaven-data/icons/general/fh-shield-bw-icon.png";
import retaliateIcon from "../frosthaven-data/icons/general/fh-retaliate-bw-icon.png";
import pierceIcon from "../frosthaven-data/icons/conditions/fh-pierce-bw-icon.png";
import healIcon from "../frosthaven-data/icons/general/fh-heal-bw-icon.png";
import pushIcon from "../frosthaven-data/icons/conditions/fh-push-bw-icon.png";
import pullIcon from "../frosthaven-data/icons/conditions/fh-pull-bw-icon.png";
import teleportIcon from "../frosthaven-data/icons/general/fh-teleport-bw-icon.png";

import type { Plus1Target } from "./plus-1-targets";

const mapping = {
	move: moveIcon,
	attack: attackIcon,
	range: rangeIcon,
	target: targetIcon,
	shield: shieldIcon,
	retaliate: retaliateIcon,
	pierce: pierceIcon,
	heal: healIcon,
	push: pushIcon,
	pull: pullIcon,
	teleport: teleportIcon,
} as const satisfies Partial<Record<Plus1Target, string>>;

export function getPlus1ImgSrc(target: keyof typeof mapping): string {
	return mapping[target];
}
