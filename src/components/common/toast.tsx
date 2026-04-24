import { AnimatePresence, motion } from "framer-motion";
import { useState, useCallback } from "react";
import { useToastListener } from "@/hooks/use-toast";

/**
 * Single-slot toast. Rendered once at SiteLayout root.
 * role="status" so SR announces without interrupting.
 */
export function Toast() {
  const [message, setMessage] = useState<string | null>(null);

  const handleMsg = useCallback((msg: string | null) => {
    setMessage(msg);
  }, []);

  useToastListener(handleMsg);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          role="status"
          aria-live="polite"
          className="glass fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 z-[60] -translate-x-1/2 rounded-pill px-5 py-2.5 text-xs uppercase tracking-widest text-on-surface"
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
