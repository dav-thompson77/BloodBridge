"use client";

import { useRef, type PointerEvent } from "react";

const NODE_ANGLES = [0, 60, 120, 180, 240, 300];

const ORBITS: Array<{
  radius: number;
  className: string;
  nodeClass: string;
  delay: string;
}> = [
  {
    radius: 72,
    className: "impact-orbit-one",
    nodeClass: "impact-node-one",
    delay: "0ms",
  },
  {
    radius: 98,
    className: "impact-orbit-two",
    nodeClass: "impact-node-two",
    delay: "260ms",
  },
  {
    radius: 124,
    className: "impact-orbit-three",
    nodeClass: "impact-node-three",
    delay: "520ms",
  },
];

export function ImpactNetwork() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const setSceneMotion = (tiltX: number, tiltY: number, spinSeconds: number) => {
    const scene = sceneRef.current;
    if (!scene) {
      return;
    }
    scene.style.setProperty("--impact-tilt-x", `${tiltX.toFixed(2)}deg`);
    scene.style.setProperty("--impact-tilt-y", `${tiltY.toFixed(2)}deg`);
    scene.style.setProperty("--impact-spin-duration", `${spinSeconds.toFixed(2)}s`);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const scene = sceneRef.current;
    if (!scene) {
      return;
    }

    const rect = scene.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const normalizedX = (localX / rect.width - 0.5) * 2;
    const normalizedY = (localY / rect.height - 0.5) * 2;

    const tiltY = normalizedX * 12;
    const tiltX = -normalizedY * 9;

    const now = performance.now();
    const previous = pointerRef.current;

    let spinSeconds = 20;
    if (previous) {
      const deltaX = event.clientX - previous.x;
      const deltaY = event.clientY - previous.y;
      const dt = Math.max(now - previous.t, 1);
      const speed = Math.hypot(deltaX, deltaY) / dt;
      spinSeconds = 22 - Math.min(speed, 2.5) * 6.2;
      spinSeconds = Math.min(24, Math.max(6, spinSeconds));
    }

    pointerRef.current = { x: event.clientX, y: event.clientY, t: now };
    setSceneMotion(tiltX, tiltY, spinSeconds);
  };

  const handlePointerLeave = () => {
    pointerRef.current = null;
    setSceneMotion(0, 0, 20);
  };

  return (
    <div className="rounded-xl border-2 border-primary/30 bg-background p-3 shadow-lg shadow-primary/10">
      <div
        ref={sceneRef}
        className="impact-network-scene rounded-lg border bg-gradient-to-b from-background via-accent/20 to-background"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className="impact-network-tilt">
          <div className="impact-network-rotator">
            {ORBITS.map((orbit) => (
              <div key={orbit.className} className={`impact-orbit ${orbit.className}`}>
                <div className="impact-ring" />
                {NODE_ANGLES.map((angle, index) => (
                  <span
                    key={`${orbit.className}-${angle}`}
                    className={`impact-node ${orbit.nodeClass}`}
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${orbit.radius}px)`,
                      animationDelay: `calc(${orbit.delay} + ${index * 90}ms)`,
                    }}
                  />
                ))}
              </div>
            ))}
            <div className="impact-core">
              <span className="impact-core-dot" />
              <span className="impact-core-pulse" />
            </div>
          </div>
        </div>
      </div>
      <p className="border-t px-3 py-2 text-xs text-muted-foreground">
        Every donation strengthens a connected response network — one donor
        helps multiple patients across centres in real time.
      </p>
    </div>
  );
}
