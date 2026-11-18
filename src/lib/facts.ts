/** Splits a fact like "629 company career pages" into its leading number and the rest. */
export function splitFact(fact: string): [string | undefined, string] {
  const match = fact.match(/^(\d[\d,.]*\+?) (.+)$/);
  return match ? [match[1], match[2]] : [undefined, fact];
}
