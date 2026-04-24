import { useCallback, useEffect, useReducer, useRef } from "react";
import { buildDeck, computeMemoryScore, type MemoryCard } from "./card-deck";

type Status = "idle" | "playing" | "completed";

interface State {
  deck: MemoryCard[];
  flipped: string[]; // uids currently flipped this turn (max 2)
  matched: Set<string>; // symbolIds matched
  moves: number;
  status: Status;
  startedAt: number | null;
  finishedAt: number | null;
  locked: boolean; // briefly true while a mismatched pair is shown
}

type Action =
  | { type: "RESET" }
  | { type: "FLIP"; uid: string }
  | { type: "RESOLVE_MATCH"; symbolId: string }
  | { type: "RESOLVE_MISS" }
  | { type: "FINISH" };

const initial = (): State => ({
  deck: buildDeck(),
  flipped: [],
  matched: new Set(),
  moves: 0,
  status: "idle",
  startedAt: null,
  finishedAt: null,
  locked: false,
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "RESET":
      return initial();
    case "FLIP": {
      if (state.locked) return state;
      if (state.flipped.includes(action.uid)) return state;
      if (state.flipped.length >= 2) return state;

      const card = state.deck.find((c) => c.uid === action.uid);
      if (!card || state.matched.has(card.symbolId)) return state;

      const flipped = [...state.flipped, action.uid];
      const newState: State = {
        ...state,
        flipped,
        status: state.status === "idle" ? "playing" : state.status,
        startedAt: state.startedAt ?? Date.now(),
      };

      if (flipped.length === 2) {
        const [a, b] = flipped;
        const cardA = state.deck.find((c) => c.uid === a);
        const cardB = state.deck.find((c) => c.uid === b);
        const isMatch = cardA && cardB && cardA.symbolId === cardB.symbolId;
        return { ...newState, moves: state.moves + 1, locked: !isMatch };
      }
      return newState;
    }
    case "RESOLVE_MATCH": {
      const matched = new Set(state.matched);
      matched.add(action.symbolId);
      return { ...state, matched, flipped: [], locked: false };
    }
    case "RESOLVE_MISS":
      return { ...state, flipped: [], locked: false };
    case "FINISH":
      return { ...state, status: "completed", finishedAt: Date.now() };
    default:
      return state;
  }
}

export function useMemoryGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resolve flipped pair after second flip
  useEffect(() => {
    if (state.flipped.length !== 2) return;
    const [a, b] = state.flipped;
    const cardA = state.deck.find((c) => c.uid === a);
    const cardB = state.deck.find((c) => c.uid === b);
    if (!cardA || !cardB) return;

    if (cardA.symbolId === cardB.symbolId) {
      // Match: small delay so user sees both faces
      timeoutRef.current = setTimeout(() => dispatch({ type: "RESOLVE_MATCH", symbolId: cardA.symbolId }), 400);
    } else {
      // Miss: longer delay so user can memorize positions
      timeoutRef.current = setTimeout(() => dispatch({ type: "RESOLVE_MISS" }), 800);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state.flipped, state.deck]);

  // Detect completion
  useEffect(() => {
    if (state.status === "playing" && state.matched.size === 12) {
      dispatch({ type: "FINISH" });
    }
  }, [state.matched, state.status]);

  const flip = useCallback((uid: string) => dispatch({ type: "FLIP", uid }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  /**
   * Returns current elapsed time. Pure caller wraps a stable now-source so the
   * hook stays render-pure (no Date.now during render).
   */
  const computeElapsed = useCallback(
    (now: number) =>
      state.startedAt && state.finishedAt
        ? state.finishedAt - state.startedAt
        : state.startedAt
          ? now - state.startedAt
          : 0,
    [state.startedAt, state.finishedAt],
  );

  const finalElapsedMs =
    state.startedAt && state.finishedAt ? state.finishedAt - state.startedAt : 0;

  const score =
    state.status === "completed" && state.startedAt && state.finishedAt
      ? computeMemoryScore(state.moves, state.finishedAt - state.startedAt)
      : null;

  return {
    deck: state.deck,
    flipped: state.flipped,
    matched: state.matched,
    moves: state.moves,
    status: state.status,
    finalElapsedMs,
    computeElapsed,
    score,
    flip,
    reset,
  };
}
