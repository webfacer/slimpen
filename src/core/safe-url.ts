/**
 * Decides whether a link URL may end up in the editor's HTML output.
 *
 * Allowed: http:, https:, mailto: and relative URLs (`/path`, `./x`, `../x`, `#anchor`, `?q=1`, `//host`).
 * Everything else (javascript:, data:, vbscript:, unknown schemes, empty input) is rejected.
 *
 * See test/safe-url.test.ts for the full list of cases.
 */
export function isSafeUrl(url: string): boolean {
  // 🧠 human-memory-health-check – to be implemented
  void url
  return false
}
