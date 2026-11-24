export interface FuzzyMatchResult {
  score: number;
  indices: number[];
}

/**
 * Case-insensitive subsequence fuzzy matcher returning match score and character indices,
 * or `null` when `query` characters do not appear in order inside `text`.
 */
export function fuzzyMatch(query: string, text: string): FuzzyMatchResult | null {
  const trimmed = query.trim();
  if (!trimmed) {
    return { score: 0, indices: [] };
  }

  const q = trimmed.toLowerCase();
  const t = text.toLowerCase();
  const indices: number[] = [];

  let qi = 0;
  let score = 0;
  let prevMatchIndex = -2;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      indices.push(ti);

      // Base match point
      let charScore = 10;

      // Bonus for prefix match
      if (ti === 0) charScore += 15;

      // Bonus for consecutive matches
      if (ti === prevMatchIndex + 1) charScore += 12;

      // Bonus for word boundary / camelCase boundary
      if (ti > 0) {
        const prevChar = text[ti - 1]!;
        const currChar = text[ti]!;
        if (prevChar === ' ' || prevChar === '-' || prevChar === '_' || prevChar === '/' || prevChar === '.') {
          charScore += 10;
        } else if (prevChar === prevChar.toLowerCase() && currChar !== currChar.toLowerCase()) {
          charScore += 8;
        }
      }

      // Bonus for exact case match
      if (text[ti] === trimmed[qi]) {
        charScore += 2;
      }

      score += charScore;
      prevMatchIndex = ti;
      qi++;
    }
  }

  if (qi < q.length) {
    return null;
  }

  // Slight preference for tighter / shorter target strings
  score -= Math.max(0, text.length - q.length) * 0.25;

  return { score, indices };
}
