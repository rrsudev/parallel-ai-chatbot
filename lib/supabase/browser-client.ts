import { Database } from "@/supabase/types"
import { createBrowserClient } from "@supabase/ssr"

// .trim() guards against a stray newline/space in the env var (common when a
// long JWT is pasted into a hosting dashboard). A whitespace-tainted key would
// otherwise be sent as an HTTP header value and make every request throw
// "Failed to execute 'fetch' on 'Window': Invalid value".
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
)
