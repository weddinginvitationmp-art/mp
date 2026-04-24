/**
 * NAPAS bank BIN → brand color map.
 * 6 well-known VN banks hardcoded; fallback to muted-gold for unknown codes.
 */
const BANK_COLORS: Record<string, string> = {
  "970436": "#007A4B", // Vietcombank green
  "970407": "#D2232A", // Techcombank red
  "970422": "#1F1D60", // MB Bank navy
  "970418": "#006633", // BIDV dark green
  "970432": "#138840", // VPBank green
  "970405": "#C8102E", // Agribank red
};

const FALLBACK_COLOR = "#C9A84C"; // muted-gold

export function getBankColor(bankBin: string): string {
  return BANK_COLORS[bankBin] ?? FALLBACK_COLOR;
}
