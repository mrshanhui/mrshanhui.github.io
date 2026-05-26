/**
 * Photo captions — keyed by the image stem (filename without extension).
 *
 * Stems follow the Unsplash naming convention:
 *   "firstname-lastname-HASH-unsplash"
 *
 * Usage: add an entry for any photo you want to caption. Photos without
 * an entry (or with an empty string) will have no visible caption in the
 * fullscreen viewer.
 *
 */
export const photoCaptions: Record<string, string> = {
	// ── Add your captions below ───────────────────────────────────────────────
	// filename: "xxx",
	"DSCF5215-zipic": "某个春天的下午",
};
