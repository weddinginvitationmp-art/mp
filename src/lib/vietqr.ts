import type { BankAccount } from "@/config/wedding";

/**
 * Build a VietQR image URL (img.vietqr.io) for a given bank account.
 * `compact2` is the cleanest style with embedded logo.
 * Holder name MUST be ASCII; the caller guarantees this via config.
 */
export function buildVietQrUrl(
  account: BankAccount,
  opts: { memo?: string; amount?: number } = {},
): string {
  const params = new URLSearchParams({
    accountName: account.accountHolder,
    addInfo: opts.memo ?? "Mung cuoi",
  });
  if (opts.amount) params.set("amount", String(opts.amount));
  return `https://img.vietqr.io/image/${account.bankBin}-${account.accountNumber}-compact2.png?${params.toString()}`;
}
