/**
 * Console access is a Biome error (`noConsole`) except for
 * assert / error / info / warn. Route debug output through these helpers so
 * the rule stays enforceable and every call site is greppable.
 */

export function debugLog(...args: unknown[]) {
	// biome-ignore lint/suspicious/noConsole: logger implementation
	console.log(...args);
}

export function debugWarn(...args: unknown[]) {
	console.warn(...args);
}

export function debugError(...args: unknown[]) {
	console.error(...args);
}
