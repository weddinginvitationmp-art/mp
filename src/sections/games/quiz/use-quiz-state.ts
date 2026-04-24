import { useCallback, useState } from "react";
import { POINTS_PER_CORRECT, QUIZ_QUESTIONS } from "./questions";

type Answer = "a" | "b" | "c" | "d";
type Phase = "answering" | "revealing" | "completed";

export function useQuizState() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Array<{ qid: string; chose: Answer; correct: boolean }>>([]);
  const [selected, setSelected] = useState<Answer | null>(null);
  const [phase, setPhase] = useState<Phase>("answering");

  const current = QUIZ_QUESTIONS[idx];
  const total = QUIZ_QUESTIONS.length;

  const select = useCallback(
    (option: Answer) => {
      if (phase !== "answering" || !current) return;
      setSelected(option);
      setPhase("revealing");
    },
    [phase, current],
  );

  const advance = useCallback(() => {
    if (!current || selected === null) return;
    const isCorrect = current.correct === selected;
    const next = [...answers, { qid: current.id, chose: selected, correct: isCorrect }];
    setAnswers(next);
    setSelected(null);

    if (idx + 1 >= total) {
      setPhase("completed");
    } else {
      setIdx(idx + 1);
      setPhase("answering");
    }
  }, [current, selected, answers, idx, total]);

  const reset = useCallback(() => {
    setIdx(0);
    setAnswers([]);
    setSelected(null);
    setPhase("answering");
  }, []);

  const correctCount = answers.filter((a) => a.correct).length;
  const score = correctCount * POINTS_PER_CORRECT;

  return {
    current,
    idx,
    total,
    selected,
    phase,
    answers,
    correctCount,
    score,
    select,
    advance,
    reset,
  };
}
