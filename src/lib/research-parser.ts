/**
 * Research Parser Utility
 * Analyzes text for MUN-specific sections using keyword heuristics.
 */

export interface GapAnalysisResult {
  missingSections: string[];
  readinessScore: number; // 0-100
}

const SECTION_KEYWORDS = {
  Policy: [
    "position", "government stance", "voted for", "alignment", 
    "foreign policy", "diplomatic relations", "sovereignty"
  ],
  History: [
    "past actions", "resolutions passed", "conflict origin", 
    "historical background", "previous involvement", "chronology", "precedent"
  ],
  Solutions: [
    "propose", "suggest", "implementation", "funding", "measures", 
    "recommendation", "draft resolution", "mechanism"
  ]
};

export const analyzeResearchGaps = (text: string): GapAnalysisResult => {
  const normalizedText = text.toLowerCase();
  const missingSections: string[] = [];
  let foundCount = 0;
  const totalSections = Object.keys(SECTION_KEYWORDS).length;

  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    const hasSection = keywords.some(keyword => normalizedText.includes(keyword.toLowerCase()));
    if (!hasSection) {
      missingSections.push(section);
    } else {
      foundCount++;
    }
  }

  // Calculate score based on found sections (roughly)
  const readinessScore = Math.round((foundCount / totalSections) * 100);

  return {
    missingSections,
    readinessScore
  };
};
