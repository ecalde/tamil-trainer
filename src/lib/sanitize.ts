/**
 * Strip angle brackets and other patterns that could confuse HTML parsers.
 * React text nodes escape by default; this is an extra layer for any string
 * that ever crosses boundaries (e.g. future rich text).
 */
export function sanitizePlainText(input: string): string {
  let out = ''
  for (const ch of input) {
    if (ch === '<' || ch === '>') continue
    if (ch.charCodeAt(0) === 0) continue
    out += ch
  }
  return out.trim()
}
