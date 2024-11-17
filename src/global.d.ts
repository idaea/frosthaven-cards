import "react";

declare module "react" {
	interface CSSProperties {
		["--character-color"]?: string | undefined;
	}
}
