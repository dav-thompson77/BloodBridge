"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Handles fallback auth redirects when providers send users to `/`
 * with URL fragments (implicit flow) instead of callback query params.
 */
export function AuthHomeRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const supabase = createClient();

    const hasAuthHash =
      window.location.hash.includes("access_token") ||
      window.location.hash.includes("refresh_token");

    // Only redirect from landing when handling auth hash links.
    // Logged-in users visiting home intentionally should stay on home.
    if (!hasAuthHash) {
      return;
    }

    const settleAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      }
    };

    void settleAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
        router.replace("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  return null;
}
