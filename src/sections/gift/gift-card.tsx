import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { BankAccount } from "@/config/wedding";
import { buildVietQrUrl } from "@/lib/vietqr";
import { getBankColor } from "@/lib/bank-colors";
import { BottomSheet } from "@/components/common/bottom-sheet";
import { Chip } from "@/components/common/chip";
import { showToast } from "@/hooks/use-toast";

interface Props {
  account: BankAccount;
  memo: string;
}

export function GiftCard({ account, memo }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";
  const qrUrl = buildVietQrUrl(account, { memo });
  const bankColor = getBankColor(account.bankBin);
  const [qrOpen, setQrOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      showToast(t("gift.copied"));
    } catch {
      // clipboard may reject on non-HTTPS dev env
    }
  };

  return (
    <>
      <article className="flex flex-col items-center rounded-soft border border-ivory/10 bg-ivory/5 p-6 text-center backdrop-blur-md dark:bg-ink/30">
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted-gold">
          {account.name[lang]}
        </p>

        {/* QR — tap to enlarge */}
        <button
          type="button"
          onClick={() => setQrOpen(true)}
          aria-label={t("gift.enlargeQr")}
          className="mt-5 overflow-hidden rounded-soft bg-ivory p-3 transition active:scale-[0.98] touch-action-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold/40"
        >
          <img
            src={qrUrl}
            alt={`QR ${t("gift.scanHint")} — ${account.accountHolder}`}
            width={240}
            height={240}
            loading="lazy"
            decoding="async"
            className="size-full max-w-56"
          />
        </button>

        <dl className="mt-5 w-full space-y-3 text-sm">
          <div>
            <dt className="text-[10px] uppercase tracking-widest opacity-60">{t("gift.bank")}</dt>
            <dd className="mt-0.5 flex items-center justify-center gap-2">
              <span className="font-display text-lg">{account.bankName}</span>
              <Chip label={account.bankName} dotColor={bankColor} className="hidden sm:inline-flex" />
            </dd>
          </div>

          {/* Tap-anywhere-to-copy row */}
          <div>
            <dt className="text-[10px] uppercase tracking-widest opacity-60">
              {t("gift.accountNumber")}
            </dt>
            <dd className="mt-0.5">
              <button
                type="button"
                onClick={handleCopy}
                aria-label={t("gift.copyAriaLabel", { number: account.accountNumber })}
                className="inline-flex items-center gap-2 rounded-soft px-3 py-1.5 transition hover:bg-ivory/5 active:scale-[0.98] touch-action-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold/40 min-h-[44px]"
              >
                <code className="font-mono text-lg tracking-wider">{account.accountNumber}</code>
                <span className="rounded-pill border border-ivory/20 px-2.5 py-0.5 text-[10px] uppercase tracking-widest opacity-70">
                  {t("gift.copy")}
                </span>
              </button>
            </dd>
          </div>

          <div>
            <dt className="text-[10px] uppercase tracking-widest opacity-60">
              {t("gift.accountHolder")}
            </dt>
            <dd className="mt-0.5 text-sm opacity-80">{account.accountHolder}</dd>
          </div>
        </dl>
      </article>

      {/* QR enlarge bottom-sheet */}
      <BottomSheet open={qrOpen} onClose={() => setQrOpen(false)} title={t("gift.enlargeQr")}>
        <div className="flex flex-col items-center gap-4 pb-2">
          <div className="rounded-soft bg-ivory p-4">
            <img
              src={qrUrl}
              alt={`QR — ${account.accountHolder}`}
              width={280}
              height={280}
              className="size-full max-w-[80vw]"
            />
          </div>
          <p className="text-center text-xs uppercase tracking-widest opacity-60">
            {account.accountHolder} · {account.bankName}
          </p>
        </div>
      </BottomSheet>
    </>
  );
}
