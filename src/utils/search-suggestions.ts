import type { StopGroup } from "@/components/sidebar/types";

/**
 * Aliases for common abbreviations
 */
const ALIASES: Record<string, string> = {
  "św.": "świętego",
  "sw.": "świętego",
  "św": "świętego",
  "sw": "świętego",
  "os.": "osiedle",
  "os": "osiedle",
  "ul.": "ulica",
  "ul": "ulica",
  "al.": "aleja",
  "al": "aleja",
  "pl.": "plac",
  "pl": "plac",
  "gen.": "generała",
  "gen": "generała",
  "dr.": "doktora",
  "dr": "doktora",
  "prof.": "profesora",
  "prof": "profesora",
  "ks.": "księdza",
  "ks": "księdza",
};

/**
 * Remove diacritics (Polish characters like ą, ć, ę, ł, ń, ó, ś, ź, ż)
 */
function removeDiacritics(text: string): string {
  return text
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ź/g, "z")
    .replace(/ż/g, "z")
    .replace(/Ą/g, "A")
    .replace(/Ć/g, "C")
    .replace(/Ę/g, "E")
    .replace(/Ł/g, "L")
    .replace(/Ń/g, "N")
    .replace(/Ó/g, "O")
    .replace(/Ś/g, "S")
    .replace(/Ź/g, "Z")
    .replace(/Ż/g, "Z");
}

/**
 * Normalize text for searching:
 * - Remove diacritics
 * - Convert to lowercase
 * - Remove spaces, dots, commas, and other punctuation
 * - Replace aliases
 */
function normalizeText(text: string): string {
  // First expand aliases
  let normalized = text.toLowerCase();
  
  // Replace aliases (word boundaries)
  Object.entries(ALIASES).forEach(([alias, expansion]) => {
    const regex = new RegExp(`\\b${alias.replace(/\./g, "\\.")}\\b`, "gi");
    normalized = normalized.replace(regex, expansion);
  });

  // Remove diacritics
  normalized = removeDiacritics(normalized);

  // Remove all non-alphanumeric characters (spaces, dots, commas, etc.)
  normalized = normalized.replace(/[^a-z0-9]/g, "");

  return normalized;
}

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
  const nameNormalized = normalizeText(name);
  const queryNormalized = normalizeText(query);

  // Exact match (normalized) scores highest (100)
  if (nameNormalized === queryNormalized) return 100;

  // Prefix match scores very high (95)
  if (nameNormalized.startsWith(queryNormalized)) return 95;

  // Split name into words (before normalization) to check word boundaries
  const words = name.toLowerCase().split(/[\s\-\.]+/);
  const normalizedWords = words.map((w) => normalizeText(w));

  // Word boundary prefix match (90)
  if (normalizedWords.some((word) => word.startsWith(queryNormalized))) return 90;

  // Contains as substring (70)
  if (nameNormalized.includes(queryNormalized)) return 70;

  // Fuzzy match with Levenshtein distance (allows typos)
  // Allow up to 30% of query length as edit distance
  const maxDistance = Math.max(1, Math.ceil(queryNormalized.length * 0.3));
  
  // Check full name
  let distance = levenshteinDistance(queryNormalized, nameNormalized);
  if (distance <= maxDistance) {
    return Math.max(0, 50 - distance * 8); // 50 base score, -8 per edit
  }

  // Check individual words for fuzzy match
  for (const word of normalizedWords) {
    distance = levenshteinDistance(queryNormalized, word);
    if (distance <= maxDistance) {
      return Math.max(0, 45 - distance * 7); // 45 base score, -7 per edit
    }
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
