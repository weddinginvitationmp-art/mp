/**
 * 12 unique pairs for the Love Memory game.
 * Symbols chosen to match cinematic minimal palette — no clipart.
 * Use Unicode glyphs to keep bundle/Asset weight at zero.
 */
export interface MemorySymbol {
  id: string;
  glyph: string;
  label: string;
}

export const MEMORY_SYMBOLS: MemorySymbol[] = [
  { id: "ring", glyph: "◯", label: "Ring" },
  { id: "rose", glyph: "✿", label: "Rose" },
  { id: "heart", glyph: "♥", label: "Heart" },
  { id: "star", glyph: "✦", label: "Star" },
  { id: "moon", glyph: "☾", label: "Moon" },
  { id: "sun", glyph: "☀", label: "Sun" },
  { id: "bouquet", glyph: "❀", label: "Bouquet" },
  { id: "champagne", glyph: "♕", label: "Crown" },
  { id: "leaf", glyph: "❦", label: "Leaf" },
  { id: "diamond", glyph: "◆", label: "Diamond" },
  { id: "wave", glyph: "∞", label: "Infinity" },
  { id: "spark", glyph: "✧", label: "Spark" },
];

export interface MemoryCard {
  uid: string; // unique per card instance
  symbolId: string;
  glyph: string;
  label: string;
}

/**
 * Build a shuffled deck of 24 cards (12 pairs) using Fisher–Yates.
 * Caller passes a seed for testability; default uses Math.random.
 */
export function buildDeck(rng: () => number = Math.random): MemoryCard[] {
  const deck: MemoryCard[] = [];
  MEMORY_SYMBOLS.forEach((s) => {
    deck.push({ uid: `${s.id}-a`, symbolId: s.id, glyph: s.glyph, label: s.label });
    deck.push({ uid: `${s.id}-b`, symbolId: s.id, glyph: s.glyph, label: s.label });
  });

  // Fisher–Yates
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i]!, deck[j]!] = [deck[j]!, deck[i]!];
  }
  return deck;
}

/**
 * Compute final score. Lower moves + faster time = higher score.
 * Floor at 0 to avoid negative for slow players.
 */
export function computeMemoryScore(moves: number, timeMs: number): number {
  const seconds = Math.floor(timeMs / 1000);
  return Math.max(0, 1000 - moves * 5 - seconds * 2);
}
