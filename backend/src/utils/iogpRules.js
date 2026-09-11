/**
 * Canonical IOGP Life-Saving Rules as defined by IOGP Report 459:
 * 1. Bypassing Safety Controls
 * 2. Confined Space
 * 3. Driving
 * 4. Energy Isolation
 * 5. Hot Work
 * 6. Line of Fire
 * 7. Safe Mechanical Lifting
 * 8. Work Authorization
 * 9. Working at Height
 */
const CANONICAL_IOGP_RULES = Object.freeze([
  'Bypassing Safety Controls',
  'Confined Space',
  'Driving',
  'Energy Isolation',
  'Hot Work',
  'Line of Fire',
  'Safe Mechanical Lifting',
  'Work Authorization',
  'Working at Height',
]);

/**
 * Normalization dictionary mapping known variants/typos/aliases to their canonical form.
 * Ensures consistent spelling, e.g. "Work Authorisation" -> "Work Authorization".
 */
const IOGP_RULE_VARIANTS = new Map([
  ['bypassing safety controls', 'Bypassing Safety Controls'],
  ['bypassing safety control', 'Bypassing Safety Controls'],
  ['bypass safety controls', 'Bypassing Safety Controls'],
  ['bypassing controls', 'Bypassing Safety Controls'],

  ['confined space', 'Confined Space'],
  ['confined spaces', 'Confined Space'],
  ['confined space entry', 'Confined Space'],

  ['driving', 'Driving'],
  ['safe driving', 'Driving'],
  ['vehicle safety', 'Driving'],

  ['energy isolation', 'Energy Isolation'],
  ['isolation of energy', 'Energy Isolation'],
  ['lockout tagout', 'Energy Isolation'],
  ['loto', 'Energy Isolation'],

  ['hot work', 'Hot Work'],
  ['hotwork', 'Hot Work'],

  ['line of fire', 'Line of Fire'],

  ['safe mechanical lifting', 'Safe Mechanical Lifting'],
  ['mechanical lifting', 'Safe Mechanical Lifting'],
  ['lifting', 'Safe Mechanical Lifting'],

  ['work authorization', 'Work Authorization'],
  ['work authorisation', 'Work Authorization'],
  ['work permit', 'Work Authorization'],
  ['permit to work', 'Work Authorization'],

  ['working at height', 'Working at Height'],
  ['working at heights', 'Working at Height'],
  ['work at height', 'Working at Height'],
]);

/**
 * Normalizes an array of incoming IOGP rule names:
 * - Trims whitespace
 * - Resolves variants like UK spelling "Work Authorisation" to "Work Authorization"
 * - Deduplicates entries
 * - Disallows unknown rules from silently mapping to valid rules
 *
 * @param {string[]} rawRules Array of raw rule names from AI
 * @returns {string[]} Array of deduplicated canonical IOGP rules
 */
function normalizeIogpRules(rawRules) {
  if (!Array.isArray(rawRules)) {
    return [];
  }

  const seen = new Set();
  const normalized = [];

  for (const raw of rawRules) {
    if (typeof raw !== 'string') continue;
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const lower = trimmed.toLowerCase();

    // Check variant dictionary first (e.g. "Work Authorisation" -> "Work Authorization")
    let canonical = IOGP_RULE_VARIANTS.get(lower);

    // If not in variant dictionary, check if it's already an exact case-insensitive match
    if (!canonical) {
      const match = CANONICAL_IOGP_RULES.find(
        (rule) => rule.toLowerCase() === lower
      );
      if (match) {
        canonical = match;
      }
    }

    // Only add known canonical rules, preventing unknown strings from silently becoming canonical
    if (canonical && !seen.has(canonical)) {
      seen.add(canonical);
      normalized.push(canonical);
    }
  }

  return normalized;
}

module.exports = {
  CANONICAL_IOGP_RULES,
  normalizeIogpRules,
};
