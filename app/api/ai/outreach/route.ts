import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateOpenRouterOutreachSuggestions } from "@/lib/ai/openrouter";
import type { AiOutreachRequest } from "@/lib/ai/types";
import type { DonorStatus, UrgencyLevel } from "@/lib/types";

const ALLOWED_URGENCY: UrgencyLevel[] = ["low", "medium", "high", "critical"];
const ALLOWED_STATUS: DonorStatus[] = [
  "pending_verification",
  "approved",
  "temporarily_deferred",
  "eligible_again",
];

function parseRequestBody(body: unknown): AiOutreachRequest | null {
  if (!body || typeof body !== "object") {
    return null;
  }
  const payload = body as Record<string, unknown>;
  const bloodType = String(payload.bloodType ?? "").trim();
  const urgency = String(payload.urgency ?? "").trim() as UrgencyLevel;
  const centreName = String(payload.centreName ?? "").trim();
  const requiredBy = String(payload.requiredBy ?? "").trim();
  const approvalStatus = String(payload.approvalStatus ?? "approved").trim() as DonorStatus;
  const donorName = String(payload.donorName ?? "").trim();
  const messageContext = String(payload.messageContext ?? "").trim();

  if (!bloodType || !centreName || !requiredBy || !ALLOWED_URGENCY.includes(urgency)) {
    return null;
  }

  return {
    bloodType,
    urgency,
    centreName,
    requiredBy,
    approvalStatus: ALLOWED_STATUS.includes(approvalStatus)
      ? approvalStatus
      : "approved",
    donorName: donorName || "donor",
    messageContext,
  };
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "blood_bank_staff" && profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseRequestBody(body);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const result = await generateOpenRouterOutreachSuggestions(parsed);
  return NextResponse.json(result, { status: 200 });
}
