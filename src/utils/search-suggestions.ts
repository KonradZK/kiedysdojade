import type { StopGroup } from "@/components/sidebar/types";

/**
 * Levenshtein distance algorithm for fuzzy matching
 * Allows matching with typos and missing letters
 */
function levenshteinDistance(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;
  const dp: number[][] = Array(aLen + 1)
    .fill(null)
    .map(() => Array(bLen + 1).fill(0));

  for (let i = 0; i <= aLen; i++) dp[i][0] = i;
  for (let j = 0; j <= bLen; j++) dp[0][j] = j;

  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }

  return dp[aLen][bLen];
}

/**
 * Calculate relevance score for sorting results
 * Higher score = better match
 */
function getRelevanceScore(name: string, query: string): number {
  const nameLower = name.toLowerCase();
  const queryLower = query.toLowerCase();

  // Prefix match scores highest (100)
  if (nameLower.startsWith(queryLower)) return 100;

  // Word boundary match scores high (80)
  const words = nameLower.split(/[\s\-\.]+/);
  if (words.some((word) => word.startsWith(queryLower))) return 80;

  // Contains as substring (60)
  if (nameLower.includes(queryLower)) return 60;

  // Fuzzy match (lower score based on distance)
  const distance = levenshteinDistance(queryLower, nameLower);
  const maxDistance = Math.ceil(queryLower.length * 0.3);
  if (distance <= maxDistance) {
    return Math.max(0, 40 - distance * 5); // 40 base score, -5 per edit
  }

  return 0;
}

/**
 * Get smart suggestions for stop groups
 * Combines prefix matching, word boundary matching, and fuzzy matching
 * @param input User search input
 * @param stops All available stop groups
 * @param limit Maximum number of suggestions to return
 * @returns Sorted array of matching suggestions
 */
export function getSuggestions(
  input: string,
  stops: StopGroup[],
  limit: number = 8
): StopGroup[] {
  if (!input.trim()) return [];

  const scored = stops
    .map((stop) => ({
      stop,
      score: getRelevanceScore(stop.group_name, input),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ stop }) => stop);
}
