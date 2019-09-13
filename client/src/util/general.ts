export function isIOS() {
	return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}
