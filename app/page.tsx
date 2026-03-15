import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/lib/supabase/server";
import {
  Activity,
  BellRing,
  Droplets,
  Users,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-red-500/20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="text-lg font-semibold">
            Blood Bridge
          </Link>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            {user ? (
              <Button asChild>
                <Link href="/dashboard">Open dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:px-6 md:py-16">
        <div className="space-y-6">
          <p className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-300">
            Real-time donor coordination
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Help blood banks find and re-engage eligible donors in real time.
          </h1>
          <p className="text-lg text-muted-foreground">
            Blood Bridge helps blood services register, verify, schedule, and re-engage donors while supporting the
            official screening process.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-red-600 text-white hover:bg-red-500">
              <Link href={user ? "/dashboard" : "/auth/sign-up"}>Register as a donor</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/centres">View donation centres</Link>
            </Button>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-2">
            <div className="rounded-xl border border-red-500/20 bg-card/70 p-4">
              <p className="mb-1 text-sm font-semibold text-red-300">For Donors</p>
              <p className="text-sm text-muted-foreground">
                Register, track status, book appointments, and respond to alerts.
              </p>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-card/70 p-4">
              <p className="mb-1 text-sm font-semibold text-red-300">For Blood Bank Staff</p>
              <p className="text-sm text-muted-foreground">
                Create requests, filter donors, send alerts, and coordinate appointments.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-red-500/20 bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">How Blood Bridge works</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>1. Registration and account setup</li>
            <li>2. ID verification</li>
            <li>3. Medical screening and haemoglobin check</li>
            <li>4. Medical interview and approval / temporary deferral</li>
            <li>5. Donation appointment scheduling</li>
            <li>6. Real-time alerts and donor response tracking</li>
          </ul>
          <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-100">
            Important: Blood Bridge supports coordination and communication. Clinical screening and final eligibility
            decisions remain with qualified medical staff.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-6 md:px-6">
        <div className="grid gap-3 rounded-2xl border border-red-500/20 bg-card/60 p-4 md:grid-cols-4">
          <div className="rounded-lg border border-red-500/20 bg-background/60 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Coverage</p>
            <p className="mt-1 text-xl font-semibold">3 blood centres</p>
          </div>
          <div className="rounded-lg border border-red-500/20 bg-background/60 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Donor data</p>
            <p className="mt-1 text-xl font-semibold">6 donor profiles</p>
          </div>
          <div className="rounded-lg border border-red-500/20 bg-background/60 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Communication</p>
            <p className="mt-1 text-xl font-semibold">Realtime alerts</p>
          </div>
          <div className="rounded-lg border border-red-500/20 bg-background/60 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Access model</p>
            <p className="mt-1 text-xl font-semibold">Role-based coordination</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-6 md:px-6">
        <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-red-900/20 to-transparent p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Urgent requests</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-1 text-xs text-red-200">
              <Activity className="h-3.5 w-3.5" />
              live demo feed
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-red-500/30 bg-background/70 p-3">
              <p className="text-sm font-medium text-red-200">O- needed at Kingston Centre</p>
              <p className="mt-1 text-xs text-muted-foreground">Critical stock threshold triggered</p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-background/70 p-3">
              <p className="text-sm font-medium text-red-200">A+ needed within 24 hours</p>
              <p className="mt-1 text-xs text-muted-foreground">Surgery support request is active</p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-background/70 p-3">
              <p className="text-sm font-medium text-red-200">12 matching donors notified</p>
              <p className="mt-1 text-xs text-muted-foreground">Targeted outreach sent by blood type and status</p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-background/70 p-3">
              <p className="text-sm font-medium text-red-200">4 responses received</p>
              <p className="mt-1 text-xs text-muted-foreground">Interested and booked actions synced instantly</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-16 md:grid-cols-3 md:px-6">
        <div className="rounded-xl border border-red-500/20 p-5">
          <div className="mb-3 inline-flex rounded-md bg-red-500/15 p-2 text-red-300">
            <Droplets className="h-4 w-4" />
          </div>
          <h3 className="font-semibold">Donor tools</h3>
          <p className="mt-2 text-sm text-muted-foreground">Guided profile, status tracker, and appointment flow.</p>
          <p className="mt-3 text-xs font-medium text-red-300">6-step donor journey</p>
        </div>
        <div className="rounded-xl border border-red-500/20 p-5">
          <div className="mb-3 inline-flex rounded-md bg-red-500/15 p-2 text-red-300">
            <Users className="h-4 w-4" />
          </div>
          <h3 className="font-semibold">Staff tools</h3>
          <p className="mt-2 text-sm text-muted-foreground">Request creation, filtering, outreach, and scheduling.</p>
          <p className="mt-3 text-xs font-medium text-red-300">Role-based coordination</p>
        </div>
        <div className="rounded-xl border border-red-500/20 p-5">
          <div className="mb-3 inline-flex rounded-md bg-red-500/15 p-2 text-red-300">
            <BellRing className="h-4 w-4" />
          </div>
          <h3 className="font-semibold">Realtime updates</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Alerts, responses, and appointment changes refresh immediately.
          </p>
          <p className="mt-3 text-xs font-medium text-red-300">Instant alert sync</p>
        </div>
      </section>
    </main>
  );
}
