import { BellRing, CalendarCheck2, Droplets, HeartPulse } from "lucide-react";

export function ImpactNetwork() {
  return (
    <div className="rounded-xl border-2 border-primary/30 bg-background p-3 shadow-lg shadow-primary/10">
      <div className="impact-hub-scene rounded-lg border bg-gradient-to-b from-background via-accent/20 to-background">
        <div className="impact-hub-backdrop" />

        <div className="impact-hub-orbit impact-hub-orbit-a">
          <span className="impact-hub-track" />
          <span className="impact-hub-satellite" />
        </div>
        <div className="impact-hub-orbit impact-hub-orbit-b">
          <span className="impact-hub-track" />
          <span className="impact-hub-satellite" />
        </div>
        <div className="impact-hub-orbit impact-hub-orbit-c">
          <span className="impact-hub-track" />
          <span className="impact-hub-satellite" />
        </div>

        <div className="impact-hub-core">
          <span className="impact-hub-core-shell" />
          <span className="impact-hub-core-pulse impact-hub-core-pulse-one" />
          <span className="impact-hub-core-pulse impact-hub-core-pulse-two" />
          <span className="impact-hub-core-icon">
            <Droplets className="h-6 w-6" />
          </span>
        </div>

        <div className="impact-hub-tag impact-hub-tag-1">
          <BellRing className="h-3.5 w-3.5" />
          Alerts
        </div>
        <div className="impact-hub-tag impact-hub-tag-2">
          <CalendarCheck2 className="h-3.5 w-3.5" />
          Booking
        </div>
        <div className="impact-hub-tag impact-hub-tag-3">
          <HeartPulse className="h-3.5 w-3.5" />
          Response
        </div>
      </div>
      <p className="border-t px-3 py-2 text-xs text-muted-foreground">
        A real-time coordination hub: alerts, donor responses, and appointment
        flow stay synchronized around one operational center.
      </p>
    </div>
  );
}
