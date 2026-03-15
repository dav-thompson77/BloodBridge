import { respondToAlertAction } from "@/app/actions/donor";
import { RealtimeRefresher } from "@/components/realtime/realtime-refresher";
import { StatusBadge } from "@/components/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default async function DonorAlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string; alert?: string }>;
}) {
  const params = await searchParams;
  const { supabase, profile } = await requireRole(["donor", "admin"]);

  const [alertsResult, responsesResult] = await Promise.all([
    supabase
      .from("donor_alerts")
      .select("id, message, created_at, blood_requests(blood_type_needed, urgency, required_by)")
      .eq("donor_profile_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("donor_alert_responses")
      .select("alert_id, response_status, note, responded_at")
      .eq("donor_profile_id", profile.id),
  ]);

  const alerts = alertsResult.data ?? [];
  const responses = responsesResult.data ?? [];
  const responseMap = new Map<number, (typeof responses)[number]>();
  for (const response of responses) {
    responseMap.set(response.alert_id, response);
  }

  return (
    <>
      <RealtimeRefresher donorProfileId={profile.id} />

      {params.saved === "1" ? (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Response saved</AlertTitle>
          <AlertDescription>
            Your alert response was updated and shared with blood bank staff.
          </AlertDescription>
        </Alert>
      ) : null}

      {params.error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Could not save response</AlertTitle>
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Real-time alerts</CardTitle>
          <CardDescription>
            Respond as interested, booked, or unavailable so staff can coordinate quickly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.length ? (
            alerts.map((alert) => {
              const response = responseMap.get(alert.id);
              const request = Array.isArray(alert.blood_requests)
                ? alert.blood_requests[0]
                : alert.blood_requests;
              return (
                <div key={alert.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <StatusBadge status={response?.response_status ?? "pending"} />
                  </div>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Sent {formatDateTime(alert.created_at)} | Need:{" "}
                    {request?.blood_type_needed ?? "Any"} | Urgency: {request?.urgency ?? "unknown"}
                  </p>
                  {response?.responded_at ? (
                    <p className="mb-3 text-xs text-muted-foreground">
                      Last updated {formatDateTime(response.responded_at)}
                    </p>
                  ) : null}

                  <form action={respondToAlertAction} className="space-y-3">
                    <input type="hidden" name="alert_id" value={alert.id} />
                    <div className="space-y-2">
                      <Label>Your response</Label>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            name="response_status"
                            value="interested"
                            defaultChecked={(response?.response_status ?? "pending") === "interested"}
                            required
                            className="peer sr-only"
                          />
                          <span className="flex h-10 items-center justify-center rounded-md border border-input text-sm transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary">
                            Interested
                          </span>
                        </label>
                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            name="response_status"
                            value="booked"
                            defaultChecked={(response?.response_status ?? "pending") === "booked"}
                            className="peer sr-only"
                          />
                          <span className="flex h-10 items-center justify-center rounded-md border border-input text-sm transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary">
                            Booked
                          </span>
                        </label>
                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            name="response_status"
                            value="unavailable"
                            defaultChecked={(response?.response_status ?? "pending") === "unavailable"}
                            className="peer sr-only"
                          />
                          <span className="flex h-10 items-center justify-center rounded-md border border-input text-sm transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary">
                            Unavailable
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2 max-w-lg">
                      <Label htmlFor={`note-${alert.id}`}>Note (optional)</Label>
                      <Input
                        id={`note-${alert.id}`}
                        name="note"
                        defaultValue={response?.note ?? ""}
                        placeholder="Add availability note"
                      />
                    </div>
                    <div className="flex items-center justify-end">
                      <Button type="submit">Save response</Button>
                    </div>
                  </form>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No alerts have been sent yet.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
