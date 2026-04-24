/**
 * Quiz bank. Question text + options live in i18n JSON;
 * here we only keep ids + correct answer + scoring rules.
 */
export interface QuizQuestion {
  id: string;
  correct: "a" | "b" | "c" | "d";
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: "q1", correct: "b" },
  { id: "q2", correct: "c" },
  { id: "q3", correct: "a" },
  { id: "q4", correct: "d" },
  { id: "q5", correct: "b" },
  { id: "q6", correct: "a" },
  { id: "q7", correct: "c" },
  { id: "q8", correct: "d" },
];

export const QUIZ_OPTIONS: Array<"a" | "b" | "c" | "d"> = ["a", "b", "c", "d"];
export const POINTS_PER_CORRECT = 125;
