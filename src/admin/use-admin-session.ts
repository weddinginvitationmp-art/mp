import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface State {
  user: User | null;
  loading: boolean;
}

/**
 * Reactive admin session: reads current session on mount + subscribes to auth changes.
 * Exposes signIn / signOut passthroughs; surface errors to callers.
 */
export function useAdminSession() {
  const [state, setState] = useState<State>({ user: null, loading: true });

  useEffect(() => {
    void supabaseAdmin.auth.getSession().then(({ data }) => {
      setState({ user: data.session?.user ?? null, loading: false });
    });

    const { data: sub } = supabaseAdmin.auth.onAuthStateChange(
      (_event, session: Session | null) => {
        setState({ user: session?.user ?? null, loading: false });
      },
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return {
    ...state,
    signIn: (email: string, password: string) =>
      supabaseAdmin.auth.signInWithPassword({ email, password }),
    signOut: () => supabaseAdmin.auth.signOut(),
  };
}
