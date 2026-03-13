export type TSpeechAnalyze = {
  scores: {
    structure: string;
    policy: string;
    substance: string;
    rhetoric: string;
  };
  overall_grade: string;
  feedback: {
    // Forces exactly 3 strings
    strengths: [string, string, string];

    // Forces exactly 3 strings
    weaknesses: [string, string, string];

    // Forces either exactly 2 OR exactly 3 strings
    improvement_tips: [string, string] | [string, string, string];
  };
};
