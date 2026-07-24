export const EMERGENCY_KEYWORDS = [
  "heavy bleeding", "bleeding heavily", "seizure", "seizures", "unconscious",
  "unresponsive", "poison", "poisoned", "poisoning", "severe breathing",
  "difficulty breathing", "struggling to breathe", "can't breathe", "cannot breathe",
  "hit by a car", "hit by vehicle", "hit by car", "broken bone", "fracture",
  "collapsed", "collapse"
];

export function containsEmergencyKeyword(text) {
  const t = (text || "").toLowerCase();
  return EMERGENCY_KEYWORDS.some((k) => t.includes(k));
}
