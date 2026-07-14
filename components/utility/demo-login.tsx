"use client"

// TEMPORARY demo bypass for the real login flow.
//
// Signs the visitor into a shared demo account (client-side, so it does not
// depend on the server actions in app/[locale]/login/page.tsx) and forwards
// them to that account's home workspace. Remove this component and restore the
// commented-out form in login/page.tsx to bring the real auth flow back.

import { getHomeWorkspaceByUserId } from "@/db/workspaces"
import { supabase } from "@/lib/supabase/browser-client"
import { IconLoader2 } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { FC, useEffect, useState } from "react"

export const DemoLogin: FC = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        let {
          data: { session }
        } = await supabase.auth.getSession()

        if (!session) {
          // Demo credentials. These are intentionally public (this is a shared,
          // throwaway demo account). Env vars can override them, but hardcoded
          // defaults are used so the demo works with no Vercel configuration.
          const email = process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@squidy.app"
          const password =
            process.env.NEXT_PUBLIC_DEMO_PASSWORD || "squidy-demo-2026"

          const { error: signInError } = await supabase.auth.signInWithPassword(
            { email, password }
          )
          if (signInError) throw signInError

          session = (await supabase.auth.getSession()).data.session
        }

        const homeWorkspaceId = await getHomeWorkspaceByUserId(session!.user.id)
        router.push(`/${homeWorkspaceId}/chat`)
      } catch (e: any) {
        setError(e?.message || "Could not enter the demo.")
      }
    })()
  }, [router])

  return (
    <div className="flex size-full flex-col items-center justify-center gap-2">
      {error ? (
        <div className="text-center text-red-500">
          <div className="font-semibold">Demo login failed</div>
          <div className="text-sm">{error}</div>
        </div>
      ) : (
        <>
          <IconLoader2 className="animate-spin" size={40} />
          <div className="text-muted-foreground text-sm">Entering demo…</div>
        </>
      )}
    </div>
  )
}
