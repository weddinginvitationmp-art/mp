import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/button";

interface Props {
  title: string;
  subtitle?: string;
  /** Show the "Play again" / close actions. If omitted, caller renders own. */
  onClose?: () => void;
  onPlayAgain?: () => void;
  children: ReactNode;
}

/**
 * Standard chrome inside a game bottom-sheet: header, body, footer actions.
 * Keeps individual games tight on markup.
 */
export function GameShell({ title, subtitle, onClose, onPlayAgain, children }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <header className="text-center">
        <h3 className="font-display text-xl text-ivory">{title}</h3>
        {subtitle && <p className="mt-1 text-xs uppercase tracking-[0.3em] opacity-60">{subtitle}</p>}
      </header>

      <div className="min-h-[280px]">{children}</div>

      {(onClose || onPlayAgain) && (
        <footer className="flex gap-3 pt-2">
          {onPlayAgain && (
            <Button variant="primary" className="flex-1" onClick={onPlayAgain}>
              {t("games.playAgain")}
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" className="flex-1" onClick={onClose}>
              {t("games.close")}
            </Button>
          )}
        </footer>
      )}
    </div>
  );
}
