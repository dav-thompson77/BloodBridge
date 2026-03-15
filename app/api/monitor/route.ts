import { createClient } from "@/lib/supabase/server";
import { runAIMonitor } from "@/lib/ai/monitor";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const monitorSecret = process.env.MONITOR_SECRET;
  if (!monitorSecret) {
    return NextResponse.json({ error: "MONITOR_SECRET is not configured." }, { status: 500 });
  }

  // Secure the endpoint with a secret key
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret") ?? request.headers.get("x-monitor-secret");

  if (secret !== monitorSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Get a staff profile to act as the sender
  const { data: staffProfile, error: staffProfileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "blood_bank_staff")
    .limit(1)
    .single();

  if (staffProfileError) {
    return NextResponse.json(
      { error: `Could not load staff profile: ${staffProfileError.message}` },
      { status: 500 },
    );
  }

  if (!staffProfile) {
    return NextResponse.json({ error: "No staff profile found" }, { status: 500 });
  }

  try {
    const result = await runAIMonitor(supabase, { sentByProfileId: staffProfile.id });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Monitor run failed unexpectedly.",
      },
      { status: 500 },
    );
  }
}