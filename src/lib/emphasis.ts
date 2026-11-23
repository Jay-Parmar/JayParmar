/** Splits text on ** marks, so the parts at odd positions are the bold ones. */
export function emphasis(text: string): string[] {
  return text.split(/\*\*(.+?)\*\*/);
}
