"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { runAIMonitor } from "@/lib/ai/monitor";
import type { MonitorActionState } from "@/app/actions/monitor-types";

export async function triggerAIMonitorNowAction(
  _previousState: MonitorActionState,
  _formData: FormData,
): Promise<MonitorActionState> {
  void _previousState;
  void _formData;

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        status: "error",
        message: "You must be signed in as blood bank staff to run the monitor.",
        result: null,
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (profileError) {
      return {
        status: "error",
        message: `Could not load your profile: ${profileError.message}`,
        result: null,
      };
    }

    if (!profile || (profile.role !== "blood_bank_staff" && profile.role !== "admin")) {
      return {
        status: "error",
        message: "Only blood bank staff can run the AI monitor.",
        result: null,
      };
    }

    const result = await runAIMonitor(supabase, { sentByProfileId: profile.id });

    revalidatePath("/staff/monitor");
    revalidatePath("/staff/alerts");
    revalidatePath("/donor");
    revalidatePath("/donor/alerts");

    if (!result.processedRequests) {
      return {
        status: "success",
        message: "No active critical requests were found to process.",
        result,
      };
    }

    if (!result.alertsCreated && !result.donorsMatched) {
      return {
        status: "success",
        message: "No eligible matching donors were found for current critical requests.",
        result,
      };
    }

    if (!result.alertsCreated && result.deduped > 0) {
      return {
        status: "success",
        message:
          "Monitor ran successfully, but no new alerts were created because matching donors were recently alerted.",
        result,
      };
    }

    return {
      status: "success",
      message: `Monitor ran successfully and created ${result.alertsCreated} donor alert(s).`,
      result,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "AI monitor failed. Please try again.",
      result: null,
    };
  }
}
