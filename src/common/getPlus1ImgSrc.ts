import moveIcon from "../submodules/frosthaven-data/images/art/frosthaven/icons/general/fh-move-bw-icon.png";
import attackIcon from "../submodules/frosthaven-data/images/art/frosthaven/icons/general/fh-attack-bw-icon.png";
import rangeIcon from "../submodules/frosthaven-data/images/art/frosthaven/icons/general/fh-range-bw-icon.png";
import targetIcon from "../submodules/frosthaven-data/images/art/frosthaven/icons/general/fh-target-bw-icon.png";
import shieldIcon from "../submodules/frosthaven-data/images/art/frosthaven/icons/general/fh-shield-bw-icon.png";
import retaliateIcon from "../submodules/frosthaven-data/images/art/frosthaven/icons/general/fh-retaliate-bw-icon.png";
import pierceIcon from "../submodules/frosthaven-data/images/art/frosthaven/icons/conditions/fh-pierce-bw-icon.png";
import healIcon from "../submodules/frosthaven-data/images/art/frosthaven/icons/general/fh-heal-bw-icon.png";
import pushIcon from "../submodules/frosthaven-data/images/art/frosthaven/icons/conditions/fh-push-bw-icon.png";
import pullIcon from "../submodules/frosthaven-data/images/art/frosthaven/icons/conditions/fh-pull-bw-icon.png";
import teleportIcon from "../submodules/frosthaven-data/images/art/frosthaven/icons/general/fh-teleport-bw-icon.png";

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
