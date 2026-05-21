/**
 * Format description text by:
 * - Converting newlines and bullet points to proper HTML
 * - Handles both inline bullets (space-bullet-space) and line-based bullets
 * - Lines/sections starting with "- " or "• " become <li> items wrapped in <ul>
 * - Other text becomes paragraphs
 */
export function formatDescription(text: string): string {
  if (!text) return ''

  // First, split by newline
  let allLines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  // remove "- " or "• "
  allLines = allLines.map(line => line.replace(/^[-•]\s+/, ''))


  return allLines.map(line => {
    // If the line starts with a bullet, wrap it in <li>
    if (/^[-•]\s+/.test(line)) {
      return `<li>${line.replace(/^[-•]\s+/, '')}</li>`
    }
    // Otherwise, wrap it in a <p>
    return `<p>${line}</p>`
  }).join('')
}
