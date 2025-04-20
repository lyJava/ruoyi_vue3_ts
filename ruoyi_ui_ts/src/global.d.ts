import { ComponentSize } from "element-plus";

declare global {
	interface Window {
		$ELEMENT?: {
			size?: ComponentSize;
			zIndex?: number;
		};
	}
}
