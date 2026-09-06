import {
  isAuthApiError,
  isAuthRetryableFetchError,
  type AuthError,
} from "@supabase/supabase-js";

// Network failures, rate limits, and auth-server 5xx — the session may still
// be perfectly valid, so these must never be treated as "signed out".
export function isTransientAuthError(error: AuthError): boolean {
  if (isAuthRetryableFetchError(error)) return true;
  if (isAuthApiError(error) && (error.status === 429 || error.status >= 500)) {
    return true;
  }
  return false;
}
