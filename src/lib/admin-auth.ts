import { supabase } from "@/lib/supabase";

/**
 * Sign in using Supabase Auth (email + password).
 * Returns true on success, false on failure.
 */
export async function loginAdmin(email: string, password: string): Promise<boolean> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("loginAdmin:", error.message);
    return false;
  }
  return true;
}

/**
 * Sign out the current admin session.
 */
export async function logoutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Check if there is an active authenticated session.
 * NOTE: this is async because it checks the Supabase session.
 */
export async function isAdminLoggedIn(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

/**
 * Subscribe to auth state changes. Call the returned unsubscribe fn on cleanup.
 */
export function onAuthChange(
  callback: (loggedIn: boolean) => void
): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(!!session);
  });
  return () => data.subscription.unsubscribe();
}
